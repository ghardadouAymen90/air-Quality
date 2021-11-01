const _ = require('lodash');
const winston = require('winston');
require('winston-daily-rotate-file'); // module for rotating logs

const version = require('../../package.json').goroco;
const logLevel = global.globalParameters.get("logs").logLevel;
const logPath = global.globalParameters.get("logs").logPath;
const datePattern = global.globalParameters.get("logs").datePattern;
const maxFiles = global.globalParameters.get("logs").maxFiles;
const maxSize = global.globalParameters.get("logs").maxSize;
const SPLAT = Symbol.for('splat');
const MESSAGE = Symbol.for('message');


const jsonFormatter = (logEntry) => {
    if (!_.isString(logEntry['message'])) {
        var keys = [];
        for (var k in logEntry['message']) {
            keys.push(k);
        }
        for (var i = 0; i < keys.length; i++) {
            logEntry[keys[i]] = logEntry['message'][keys[i]];
        }
        logEntry.message = undefined; // to force delete message entry
    }

    var reqID = logEntry[SPLAT];
    if (logEntry[SPLAT] !== undefined) {
        reqID = (logEntry[SPLAT]).toString();
    }


    const base = {
        timestamp: logEntry.start ? logEntry.start : new Date(),
        component: "airQuality",
        level: logLevel,
        requestId: reqID,
        url: logEntry['url'],
        host: logEntry['host'],
        version: version,
        statusCode: logEntry['statusCode']
    };

    const json = Object.assign(base, logEntry);

    if (_.isUndefined(logEntry[MESSAGE])) {
        logEntry[MESSAGE] = JSON.stringify(json);
    }
    return logEntry;
}

let myTransport = (level) => {
    return new winston.transports.DailyRotateFile({
        level: (level == "access") ? "info" : level,
        filename: level + '-%DATE%.log',
        dirname: logPath,
        datePattern,
        handleExceptions: true,
        zippedArchive: true,
        typeFormat: 'json',
        maxFiles,
        maxSize,
        createSymlink: true,
        symlinkName: level + '.log',
        auditFile: `${logPath}/configLogs/airQuality.${level}-audit.json`
    });
}



let logger;
if (logLevel.toLowerCase() === 'info') {
    logger = winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
            winston.format(info => {
                info.level = info.level.toUpperCase()
                return info;
            })(),
            winston.format(jsonFormatter)()
        ),
        transports: [
            myTransport('access'),
            myTransport('error')
        ]
    });
} else if (logLevel.toLowerCase() === 'error') {
    logger = winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
            winston.format(info => {
                info.level = info.level.toUpperCase()
                return info;
            })(),
            winston.format(jsonFormatter)()
        ),
        transports: [
            myTransport('error')
        ]
    });
} else {
    logger = winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
            winston.format(info => {
                info.level = info.level.toUpperCase()
                return info;
            })(),
            winston.format(jsonFormatter)()
        ),
        transports: [
            myTransport('debug'),
            myTransport('access'),
            myTransport('error'),
            new winston.transports.Console()
        ]
    });
}

module.exports = logger;

