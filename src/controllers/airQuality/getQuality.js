const _ = require('lodash');
const axios = require('axios').default;
const winston = require('../../logger/winstonLogger');
const responseError = require('../../helpers/responseError');
const responseTimeCalculator = require('../../helpers/responseTimeCalculator');
const parameters = global.globalParameters.get("iqairData");

module.exports = class GetAirQuality {
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
            'airQuality',
            this.client
        );
    }


    async getQuality() {
        const baseUrl = parameters.url;
        const { lon, lat } = this.req.query;

        if ((Object.keys(this.req.query).length > 2) || (typeof lon !== "undefined" && isNaN(lon)) || (typeof lon !== "undefined" && isNaN(lat))) {
            this.errorFormatting({ error_code: 28 }, { http_status: 400 });
        }
        else {
            const longitude = lon ? `&lon=${lon}` : '';
            const latitude = lat ? `&lat=${lat}` : '';
            const apiKey = process.env.apiKey || parameters.apiKey;
            const key = `&key=${apiKey}`;

            await axios.get(`${baseUrl}/v2/nearest_city?${latitude}${longitude}${key}`)
                .then(response => {

                    const { pollution } = response.data.data.current;

                    this.res.status(200).send({ result: { pollution } });

                    let responseTime = responseTimeCalculator(this.res.locals.hrTimeStart);
                    let messageInfo = {
                        start: this.start,
                        service: "GET",
                        resource: "airQuality",
                        url: this.req.url,
                        host: this.client,
                        statusCode: 200,
                        responseTime
                    };

                    winston.info(messageInfo, this.requestId);
                    winston.debug('get airQuality - done ok', this.requestId);

                })
                .catch(err => {
                    this.res.send(err.response.data);
                    winston.error('get airQuality - failed', this.requestId);
                    winston.error({ ...err.response.data }, this.requestId);


                })
        }
    }
}