const _ = require('lodash');
const winston = require('../../logger/winstonLogger');
const responseError = require('../../helpers/responseError');
const responseTimeCalculator = require('../../helpers/responseTimeCalculator');
const PollutionModel = require('../../models/pollutionModel');

module.exports = class GetMostPollutedTime {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.requestId = req.correlationId();
        this.start = res.locals.startDate;
        this.client = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"] : "localhost";
    }


    // format error 
    errorFormatting(errorCode, httpCode) {
        return responseError(
            httpCode,
            errorCode,
            this.res,
            winston,
            this.requestId,
            this.req.url,
            'GET',
            'airQuality-mostPollutedTime',
            this.client
        );
    }

    // check a value'emptiness by lodash
    checkFormatByLodash(variable) {
        return _.isEmpty(variable) || _.isUndefined(variable) || _.isNull(variable);
    }


    async getMostPollutedTime() {

        new PollutionModel('pollution_paris').getMostPollutedTime()
            .then(response => {

                this.res.status(200).send(response);

                let responseTime = responseTimeCalculator(this.res.locals.hrTimeStart);
                let messageInfo = {
                    start: this.start,
                    service: "GET",
                    resource: 'airQuality-mostPollutedTime',
                    url: this.req.url,
                    host: this.client,
                    statusCode: 200,
                    responseTime
                };

                winston.info(messageInfo, this.requestId);
                winston.debug('get most polluted time in paris - done ok', this.requestId);

            })
            .catch(err => {
                this.res.send(err);
                winston.error('get most polluted time in paris - failed', this.requestId);
            })
    }
}
