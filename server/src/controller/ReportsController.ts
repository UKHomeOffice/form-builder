import {BaseHttpController, controller, httpGet, request, response} from "inversify-express-utils";
import TYPE from "../container/TYPE";
import {inject} from "inversify";
import axios from 'axios';
import * as express from 'express';
import {KeycloakService} from "../auth/KeycloakService";
import logger from "../util/logger";
import _ from 'lodash';

@controller('')
export class ReportsController extends BaseHttpController {

    constructor(@inject(TYPE.AppConfig) private readonly appConfig: any,
                @inject(TYPE.KeycloakService) private readonly keycloakService: KeycloakService) {
        super();
    }

    @httpGet('/reports', TYPE.ProtectMiddleware)
    public async reports(
        @request() req: express.Request,
        @response() res: express.Response,
    ): Promise<void> {
        logger.info('Getting report data');
        const instance = axios.create();
        const perEnvResults = await axios.all(this.appConfig.environments.map(async (environment) => {
            const url = `${environment.url}/form?countOnly=true`;
            const token = await this.keycloakService.token(environment.id);
            try {
                const response = await instance({
                    url: url,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                return {
                    environment: environment,
                    response: response.data
                };
            } catch (error) {
                logger.error(`Failed to total form count from ${environment.url} ${error.message}` );
                return {
                    environment: environment,
                    response: {
                        total: 0
                    }
                };
            }
        }));

        const formsCountData = _.map(perEnvResults, (result: { environment: any, response: any }) => {
            return {
                "id": result.environment.id,
                "label": result.environment.label,
                "value": result.response ? parseInt(result.response.total) : 0
            }
        });

        const formTypeResults = await axios.all(this.appConfig.environments.map(async (environment) => {
            const token = await this.keycloakService.token(environment.id);

            try {
                const formTypes = await instance({
                    url: `${environment.url}/form?filter=display__eq__form&countOnly=true`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const wizardTypes = await instance({
                    url: `${environment.url}/form?filter=display__eq__wizard&countOnly=true`,
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                return {
                    environment: environment.id,
                    formTypes: formTypes.data,
                    wizardTypes: wizardTypes.data
                }
            } catch (error) {
                logger.error(`Failed to get form type count from ${environment.url} ${error.stack}`);
                return {
                    environment: environment.id,
                    formTypes: {
                        total: 0
                    },
                    wizardTypes: {
                        total: 0
                    }
                }
            }
        }));
        const typeData = _.map(formTypeResults, (result: {
            environment: any,
            wizardTypes: any,
            formTypes: any
        }) => {
            const env = result.environment;
            const wizards = parseInt(result.wizardTypes.total);
            const forms = parseInt(result.formTypes.total);
            return {
                name: env,
                wizard: wizards,
                form: forms,
            }
        });

        res.json(
            {
                formsCountData: formsCountData,
                typeData:typeData
            }
        )


    }
}
