const version = require('../../../package.json').goroco;
const lastUpdate = require('../../../package.json').lastUpdate


module.exports = (req, res) => {
    let mongoConnection;
    let status;
    let message;
    let start = res.locals.startDate;

    if ((global.globalConnection === null) || global.isServerOnShutdown) {
        mongoConnection = "KO";
        status = 503;
        message = "Unvailable service";
    } else {
        mongoConnection = "OK";
        status = 200;
    }

    let component = [{
        "name": "airQuality_DB",
        "status": mongoConnection,
    }];

    let statusData = {
        "name": "air-Quality",
        "version": version,
        "status": "OK",
        "lastUpdate": lastUpdate,
        "components": component,
        "message": message
    }

    if (status != 200) {
        const responseTimeCalculator = require('../../helpers/responseTimeCalculator');
        const winston = require('../../logger/winstonLogger');

        let errorMessage = (global.globalConnection === null) ? "Database connexion failed, status is KO" : "Server is on shutdown, status is KO";
        let responseTime = responseTimeCalculator(res.locals.hrTimeStart);

        let errorMsg = {
            start: start,
            service: 'GetStatus',
            message: errorMessage,
            statusCode: 503,
            responseTime
        };
        winston.error(errorMsg);
    }

    res.status(status).send(statusData);
}
