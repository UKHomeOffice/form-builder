import {BaseHttpController, controller, httpPost, next, request, response} from 'inversify-express-utils';
import TYPE from '../container/TYPE';
import * as express from 'express';
import {FormUtil} from './FormUtil';
import {inject} from 'inversify';
import {KeycloakService} from '../auth/KeycloakService';
import axios from 'axios';
import logger from '../util/logger';
import HttpStatusCode from 'http-status-codes';

@controller('')
export class FormCreateOrUpdateController extends BaseHttpController {

    private readonly formUtil: FormUtil = new FormUtil();

    constructor(@inject(TYPE.KeycloakService) private readonly keycloakService: KeycloakService) {
        super();
    }

    @httpPost('/createOrUpdate', TYPE.ProtectMiddleware)
    public async createOrUpdate(@request() req: express.Request,
                                @response() res: express.Response,
                                @next() nextFunction: express.NextFunction): Promise<void> {

        try {
            const form: any = req.body.form;
            const env: any = req.body.env;
            const token: string = await this.keycloakService.token(env.id);
            const userId = req.headers['x-user-email'];

            const headers: object = {
                'Authorization': `Bearer ${token}`,
                'x-user-email': userId,
            };

            const formResponse = await axios({
                method: 'GET',
                headers,
                url: `${env.url}/form?filter=name__eq__${form.name},path__eq__${form.path}&limit=1`,
            });
            let formId;
            if (formResponse.data.total === 0) {
                const createFormResponse = await this.formUtil.createForm(headers, form, env);
                // @ts-ignore
                logger.info(`Form ${form.name} successfully created in ${env.id} ${createFormResponse.status}`);
                // @ts-ignore
                formId = createFormResponse.headers['x-form-id']
            } else {
                const formLoaded = formResponse.data.forms[0];
                const updateResponse = await axios({
                    method: 'PUT',
                    url: `${env.url}/form/${formLoaded.id}`,
                    data: form,
                    headers,
                });
                logger.info(`Form ${form.name} successfully updated in ${env.id} ${updateResponse.status}`);
                formId = formLoaded.id;

            }
            res.json({
                formId: formId
            }).status(HttpStatusCode.OK)
        } catch (e) {
            logger.error(e.stack);
            nextFunction(e);
        }
    }

}
