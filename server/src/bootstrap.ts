import 'reflect-metadata';
import _ from 'lodash';
import express from 'express';
import path from 'path';
import replace from 'replace-in-file';
import Ajv from 'ajv';
import cors from 'cors';
import fs from 'fs';
import logger from "./util/logger";
import schema from './configSchema.json';
import './controller';
import {EventEmitter} from "events";
import TYPE from "./container/TYPE";
import {ApplicationContext} from "./container/ApplicationContext";
import httpContext from 'express-http-context';
import {ApplicationConstants} from "./constant/ApplicationConstants";
import {InversifyExpressServer} from "inversify-express-utils";
import {KeycloakService} from "./auth/KeycloakService";
import * as bodyParser from "body-parser";

const ajv = new Ajv({allErrors: true});

const port = process.env.FORMBUILDER_PORT || 8101;

const app = express();

const validate = ajv.compile(schema);

const appConfig = JSON.parse(fs.readFileSync("/config/appConfig.json").toString("utf-8"));

const valid = validate(appConfig);
if (valid) {
    logger.info("Application config schema valid");
} else {
    logger.error("Application config schema invalid");
    validate.errors.forEach((error) => {
        logger.error(error);
    });
    logger.error("Due to config validation errors application will not start up. Goodbye.");
    process.exit(0);
}


const applicationContext: ApplicationContext = new ApplicationContext(appConfig);
const container = applicationContext.iocContainer();
const eventEmitter: EventEmitter = container.get(TYPE.EventEmitter);
const keycloakService: KeycloakService = container.get(TYPE.KeycloakService);

const sanitizedConfig = _.cloneDeep(appConfig);
sanitizedConfig.environments.forEach((environment) => {
    delete environment.service;
});

const indexPath = path.join('../client/build', 'index.html');

logger.info(`Index path exists ? ${fs.existsSync(indexPath)}`);

const processIndex = () => {
    const options = {
        files: indexPath,
        from: '__ENVIRONMENT_CONFIG__',
        to: JSON.stringify(sanitizedConfig),
    };
    const results = replace.sync(options);
    logger.info(`Replacement results`, results);
};

processIndex();



const server = new InversifyExpressServer(container,
    null,
    {rootPath: '/ui'},
    null);

server.setConfig((app) => {
    app.set('port', port);
    app.use(cors());
    app.use(httpContext.middleware);
    app.use(bodyParser.json({
        limit: '50mb',
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb',
        parameterLimit: 50000,
    }));
    app.use(keycloakService.middleware());

    if (appConfig['gov-uk-enabled']) {
        app.use('/assets', express.static('../client/node_modules/govuk-frontend/assets'));
    }
    app.use(express.static('../client/build'));

    app.use('*', (req, res, next) => {
        if (!req.originalUrl.startsWith("/ui")) {
            res.sendFile("index.html", {root: '../client/build'});
        } else  {
            next();
        }
    });

});

server.setErrorConfig((app: express.Application) => {
    app.use((err: Error,
             req: express.Request,
             res: express.Response,
             next: express.NextFunction) => {

        logger.error('An exception occurred', {
            exception: err.stack,
        });
        next(err);
    });
});

const expressApplication = server.build();

expressApplication.listen(port);
logger.info('Server up and running on ' + port);

exports = module.exports = expressApplication;

const shutDown = () => {
    logger.info('Received kill signal, shutting down gracefully');
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
    clearUp().then(() => {
        logger.info('all cleaned and finished');
    });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('SIGQUIT', shutDown);

process.on('unhandledRejection', (reason: Error, promise) => {
    logger.error('unhandledRejection', {
        exception: reason.message,
    });
});

process.on('uncaughtException', (error) => {
    logger.error('uncaughtException', error);
});


const clearUp = async () => {
    eventEmitter.emit(ApplicationConstants.SHUTDOWN_EVENT);
    process.exit(1);
};
