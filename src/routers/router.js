const ApiAirQuality = require('./ApiAirQuality/ApiAirQuality');
const getStatus = require('../controllers/status/status');

module.exports = class Router {
    constructor(app,) {
        this.app = app;
    }

    methodsCaller() {
        this.getAirQuality();
        this.getDateTime();
        this.status();
    }

    // get air quality by longitude and latitude**********************************************************************************
    getAirQuality() {
        const route = '/v2/airquality/nearest_city';
        return this.app.get(route, (req, res) => {
            new ApiAirQuality(req, res).getQuality();
        });
    }

    // get DateTime when Paris is the most polluted*******************************************************************************
    getDateTime() {
        const route = '/v2/airquality/paris/mostPollutedTime';
        return this.app.get(route, (req, res) => {
            new ApiAirQuality(req, res).getDateTime();
        });
    }

    // Get status route***********************************************************************************************************
    status() {
        const route = '/v2/airquality/status';
        return this.app.get(route, (req, res) => {
            getStatus(req, res);
        });
    }

}