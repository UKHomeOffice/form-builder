import {controller, httpPost, request, response} from 'inversify-express-utils';
import TYPE from '../container/TYPE';
import * as express from 'express';
import logger from '../util/logger';
import HttpStatusCode from 'http-status-codes';

@controller('')
export class LogController {

    @httpPost('/log', TYPE.ProtectMiddleware)
    public async log(@request() req: express.Request,
                     @response() res: express.Response): Promise<void> {
        const logStatements = req.body;
        logStatements.forEach((log) => {
            logger.log(log);
        });
        res.sendStatus(HttpStatusCode.OK);
    }
}
