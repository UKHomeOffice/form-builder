const _ = require("lodash");

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const winston = require('winston');
const {createLogger, format, transports} = winston;
const { combine, timestamp, json, splat} = format;
const port = process.env.PORT || 8101;
const fs = require("fs");
const axios = require('axios');
const replace = require('replace-in-file');


const appConfig = JSON.parse(fs.readFileSync("/config/appConfig.json"));

const sanitizedConfig = _.cloneDeep(appConfig);
sanitizedConfig.environments.forEach((environment) => {
    delete environment.service;
});

const indexPath = path.join(__dirname, 'build', 'index.html');

const logger = createLogger({
    format: combine(
        timestamp(),
        splat(),
        json()
    ),
    transports: [
        new transports.Console()
    ],
    exitOnError: false,
});


const processIndex = ()  => {
    const options = {
        files: indexPath,
        from: '__ENVIRONMENT_CONFIG__',
        to: JSON.stringify(sanitizedConfig),
    };
    const results = replace.sync(options);
    logger.info(`Replacement results`, results);
};

processIndex();

app.set('port', port);

app.use(express.json());

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };


app.get("/formio-token/:env" , asyncMiddleware(async (req, res, next) => {
    const environment = _.find(appConfig.environments, {id: req.params.env});
    try {
        const tokenResponse = await axios.post(`${environment.url}/user/login`, {
            data: {
                email: environment.service.formio.username,
                password: environment.service.formio.password
            }
        });
        res.set('x-jwt-token', tokenResponse.headers['x-jwt-token']);
        res.sendStatus(200);
    } catch (e) {
        next(e)
    }
}));

app.get("/keycloak-token/:env" , asyncMiddleware(async(req, res, next) => {
    const environment = _.find(appConfig.environments, {id: req.params.env});
     try {
         const tokenResponse = await axios({
             method: 'POST',
             url: `${environment.service.keycloak.tokenUrl}`,
             auth: {
                 username: environment.service.keycloak.clientId,
                 password: environment.service.keycloak.secret
             },
             withCredentials: true,
             headers: {
                 "Content-Type": "application/x-www-form-urlencoded"
             },
             data: "grant_type=client_credentials"
         });
         res.json(tokenResponse.data);
         res.sendStatus(200);
    } catch (e) {
        next(e)
    }
}));

app.post('/log', (req, res) => {
    const logStatements = req.body;
    logStatements.forEach((log) => {
        logger.log(log);
    });
    res.sendStatus(200);
});

const respond = (req, res) => {
    res.send('OK');
};

app.get('/healthz', respond);
app.get('/readiness', respond);

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(indexPath);
});


const server = http.createServer(app).listen(app.get('port'),  () => {
    logger.info('Form tool running ' + app.get('port'));
});


const shutDown = () => {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
        logger.info('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('SIGQUIT', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});



