const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const winston = require('winston');
const {createLogger, format, transports} = winston;
const { combine, timestamp, json, splat} = format;
const port = process.env.PORT || 8101;

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
app.set('port', port);
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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



