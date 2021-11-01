const _ = require('lodash');

const errorparsing = require('./errorParsing');
const responseTimeCalculator = require('./responseTimeCalculator');

module.exports = (httpError, error, response, logger, requestID, url, verb, resource, ip) => {

    const { error_message, error_code } = errorparsing(error);

    const responseTime = responseTimeCalculator(response.locals.hrTimeStart);

    const errorMsg = {
        requestID,
        verb,
        resource,
        url,
        host: ip,
        statusCode: httpError.http_status,
        errorCode: error_code,
        errorMessage: error_message.data?.reason,
        details: error_message.data?.message,
        responseTime
    };

    logger.error(errorMsg);

    // return error response with status
    response.status(httpError.http_status).send(error_message);

};


