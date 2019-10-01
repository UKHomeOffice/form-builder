import * as express from 'express';
import {BaseHttpController, controller, httpGet, response} from 'inversify-express-utils';
import HttpStatus from 'http-status-codes';

@controller('')
export class HealthController extends BaseHttpController {

    constructor() {
        super();
    }

    @httpGet('/healthz')
    public health(@response() res: express.Response): void {
        res.json({uptime: process.uptime()});
    }

    @httpGet('/readiness')
    public async readiness(@response() res: express.Response): Promise<void> {
        res.status(HttpStatus.OK).json({
            status: 'READY',
        });
    }
}
