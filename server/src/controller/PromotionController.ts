import {BaseHttpController, controller, httpPost, next, request, response} from 'inversify-express-utils';
import TYPE from '../container/TYPE';
import * as express from 'express';
import {inject} from 'inversify';
import {KeycloakService} from '../auth/KeycloakService';
import util from 'formiojs/utils';
import FormioUtils from 'formiojs/utils';
import _ from 'lodash';
import axios from 'axios';
import logger from '../util/logger';
import {FormUtil} from './FormUtil';

@controller('')
export class PromotionController extends BaseHttpController {

    private readonly formUtil: FormUtil = new FormUtil();

    constructor(@inject(TYPE.KeycloakService) private readonly keycloakService: KeycloakService) {
        super();
    }

    @httpPost('/promotion', TYPE.ProtectMiddleware)
    public async promote(@request() req: express.Request,
                         @response() res: express.Response,
                         @next() next: express.NextFunction): Promise<void> {


        const body = req.body;
        const formToPromote = body.form;
        const envToPromote = body.env;
        const userId = req.headers['x-user-email'];
        const currentEnv = body.currentEnv;
        const promotionEnvId = envToPromote.id;
        try {

            const promotionEnvToken = await this.keycloakService.token(envToPromote.id);
            const headers = {
                'Authorization': `Bearer ${promotionEnvToken}`,
                'x-user-email': userId,
            };

            const subFormComponents = util.searchComponents(formToPromote.components, {
                type: 'form',
            });
            const formToPromoteId = formToPromote.id;
            logger.info(`Checking if ${formToPromoteId} has any subforms...`);
            if (!_.isEmpty(subFormComponents)) {
                logger.info(`Detected subforms for ${formToPromoteId}`);

                const subFormIds = _.uniqBy(subFormComponents, (subForm) => subForm.form)
                                    .map((sub) => sub.form);
                logger.info(`Loading ${subFormIds} from environment`);

                const subForms = await Promise.all(subFormIds.map(async (subFormId) => {
                    try {
                        const formData = await axios.get(`${currentEnv.url}/form/${subFormId}`, {
                            headers: headers
                        });
                        return formData.data;
                    } catch (e) {
                        logger.error(e.message);
                        return null;
                    }
                }));

                logger.info(`${subForms.length} loaded for processing`);

                const filtered = _.filter(subForms, (form) => {
                    return !_.isNull(form);
                });

                logger.info(`Checking if final filtered forms ${filtered.length} exists in ${promotionEnvId}`);

                const subFormsFromEnv = await Promise.all(filtered.map(async (subForm: any) => {
                    const response = await axios.get(`${envToPromote.url}/form?name=${subForm.name}&select=id`,
                        {headers: headers});
                    return {
                        id: response.data.total >= 1 ? response.data.forms[0].id : null,
                        subFormToPromote: subForm
                    };
                }));
                logger.info(`${subFormsFromEnv.length} located in ${promotionEnvId}`);
                for (const data of subFormsFromEnv) {
                    let formId;

                    if (data.id) {
                        logger.info(`Sub form ${data.subFormToPromote.name} exists in ${promotionEnvId} so updating`);
                        await axios({
                            method: 'PUT',
                            url: `${envToPromote.url}/form/${data.id}`,
                            data: data.subFormToPromote,
                            headers,
                        });
                        formId = data.id;
                        logger.info('Updated latest subForm');
                    } else {
                        logger.info(`Sub form ${data.subFormToPromote.name} does not exist in ${promotionEnvId} so creating`);
                        const result = await axios({
                            method: 'POST',
                            url: `${envToPromote.url}/form`,
                            data: data.subFormToPromote,
                            headers,
                        });
                        logger.info('New subform created');
                        formId = result.headers['x-form-id'];
                    }
                    FormioUtils.eachComponent(formToPromote.components, (component) => {
                        if (component.type === 'form' && component.form === data.subFormToPromote.id) {
                            component.form = formId;
                            logger.info(`Updated subForm ${component.key} with new reference ${formId}`);
                        }
                    });
                }

            }

            const formResponse = await axios({
                method: 'GET',
                headers,
                url: `${envToPromote.url}/form?filter=name__eq__${formToPromote.name},path__eq__${formToPromote.path}&limit=1`,
            });

            if (formResponse.data.total === 0) {
                const response: any = await this.formUtil.createForm(headers, formToPromote, envToPromote);
                logger.info(`New form promoted to ${envToPromote.id} and result ${response.status}`);
            } else {
                logger.info(`Form ${formToPromote.name} does exists in ${envToPromote.id}, so updating`);
                const formLoaded = formResponse.data.forms[0];
                delete formLoaded.components;
                formLoaded.components = formToPromote.components;

                if (envToPromote.approvalUrl) {
                    const approvalResponse = await axios({
                        method: 'POST',
                        url: `${envToPromote.approvalUrl}`,
                        data: formLoaded,
                        headers,
                    });
                    logger.info(`Posted to approval url ${envToPromote.approvalUrl}
                            and successful ${approvalResponse.status}`);
                } else {
                    const updateResponse = await axios({
                        method: 'PUT',
                        url: `${envToPromote.url}/form/${formLoaded.id}`,
                        data: formLoaded,
                        headers,
                    });
                    logger.info(`${formToPromote.name} successfully updated ${updateResponse.status}`);
                }
            }
            res.sendStatus(200);
        } catch (e) {
            logger.error(e.stack);
            throw e;
        }
    }

}
