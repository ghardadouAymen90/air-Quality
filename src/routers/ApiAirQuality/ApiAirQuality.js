const GetAirQualityForACity = require('../../controllers/airQuality/getQuality');

const GetParisMostPollutedMoment = require('../../controllers/airQuality/mostPollutedTime');

module.exports = class ApiAirQuality {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    getQuality() {
        return new GetAirQualityForACity(this.req, this.res).getQuality()
    }

    getDateTime() {
        return new GetParisMostPollutedMoment(this.req, this.res).getMostPollutedTime()
    }
}