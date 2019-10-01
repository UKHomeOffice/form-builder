import * as winston from 'winston';
import httpContext from 'express-http-context';
import {ApplicationConstants} from '../constant/ApplicationConstants';

const {combine, json, splat} = winston.format;

const addXRequestId = winston.format((info) => {
    const correlationHeader = process.env.CORRELATION_ID_REQUEST_HEADER || 'x-request-id';
    info[correlationHeader] = httpContext.get(correlationHeader);
    return info;
});

const addUserId = winston.format((info) => {
    info.user = httpContext.get(ApplicationConstants.USER_ID);
    return info;
});

const logger = winston.createLogger({
    format: combine(
        addXRequestId(),
        addUserId(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({stack: true}),
        splat(),
        json(),
    ),
    defaultMeta: {service: ApplicationConstants.SERVICE_NAME},
    transports: [
        new winston.transports.Console({
            level: 'info',
        }),
    ],
    exitOnError: false,
});

export default logger;
