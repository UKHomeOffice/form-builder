const _ = require("lodash");

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const winston = require('winston');
const {createLogger, format, transports} = winston;
const {combine, timestamp, json, splat} = format;
const port = process.env.PORT || 8101;
const fs = require("fs");
const axios = require('axios');
const replace = require('replace-in-file');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

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


const schema = fs.readFileSync("./configSchema.json");
const validate = ajv.compile(JSON.parse(schema));

const appConfig = JSON.parse(fs.readFileSync("/config/appConfig.json"));


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

const sanitizedConfig = _.cloneDeep(appConfig);
sanitizedConfig.environments.forEach((environment) => {
    delete environment.service;
});

const indexPath = path.join(__dirname, 'build', 'index.html');



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

app.set('port', port);
app.use(cors());
app.use(express.json());


const kcConfig = {
    clientId: appConfig['keycloak'].clientId,
    serverUrl: appConfig['keycloak'].authUrl,
    realm: appConfig['keycloak'].realm,
    bearerOnly: true,
};


const keycloak = new Keycloak({}, kcConfig);
app.use(keycloak.middleware());

app.get("/keycloak/:env/token",  keycloak.protect(), async (req, res, next) => {
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
        res.set("Content-Type", "application/json");
        res.json(tokenResponse.data);
    } catch (e) {
        logger.error("Failed to get keycloak token from " + environment.url, {error: e.toString()});
        next(e)
    }
});

app.post('/log', [keycloak.protect(), (req, res) => {
    const logStatements = req.body;
    logStatements.forEach((log) => {
        logger.log(log);
    });
    res.sendStatus(200);
}]);

const respond = (req, res) => {
    res.send('OK');
};

app.get('/healthz', respond);
app.get('/readiness', respond);

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(indexPath);
});


const server = http.createServer(app).listen(app.get('port'), () => {
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



