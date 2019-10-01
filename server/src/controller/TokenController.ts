import {BaseHttpController, controller, httpGet, next, request, requestParam, response,} from 'inversify-express-utils';
import * as express from 'express';

import {inject} from "inversify";
import TYPE from "../container/TYPE";
import logger from "../util/logger";
import {KeycloakService} from "../auth/KeycloakService";


@controller('')
export class TokenController extends BaseHttpController {

    constructor(@inject(TYPE.AppConfig) private readonly appConfig: any,
                @inject(TYPE.KeycloakService) private readonly keycloakService: KeycloakService) {
        super();
    }

    @httpGet('/keycloak/:env/token', TYPE.ProtectMiddleware)
    public async get(@requestParam('env') env: string,
                     @request() req: express.Request,
                     @response() res: express.Response,
                     @next() next: express.NextFunction): Promise<void> {

        try {
            const tokenResponse = await this.keycloakService.token(env);
            res.set("Content-Type", "application/json");
            res.json(tokenResponse);
        } catch (e) {
            logger.error("Failed to get keycloak token from " + env, {error: e.toString()});
            next(e)
        }
    }

}

