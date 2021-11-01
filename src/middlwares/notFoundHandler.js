const _ = require('lodash');
const winston = require('../logger/winstonLogger');
const responseError = require('../helpers/responseError');

module.exports = (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"] : "localhost";

    responseError({ http_status: 404 }, { error_code: 60 }, res, winston,
        req.correlationId(), req.url, req.method, "airQuality", ip);
};