import * as express from 'express';
import {inject} from 'inversify';
import {provide} from 'inversify-binding-decorators';
import {BaseMiddleware} from 'inversify-express-utils';
import {KeycloakService} from '../auth/KeycloakService';
import TYPE from "../container/TYPE";

@provide(TYPE.ProtectMiddleware)
export class ProtectMiddleware extends BaseMiddleware {

    private readonly keycloakProtect: express.RequestHandler;

    constructor(@inject(TYPE.KeycloakService) private readonly keycloakService: KeycloakService) {
        super();
        this.keycloakProtect = this.keycloakService.protect();
    }

    public handler(req: express.Request, res: express.Response, next: express.NextFunction): void {
        this.keycloakProtect(req, res, next);
    }
}
