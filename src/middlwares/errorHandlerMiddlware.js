const winston = require('../logger/winstonLogger');

module.exports = function (err, req, res, next) {
    winston.error({
        service: 'AirQuality',
        url: req.url,
        status: err.status,
        errorMessage: JSON.stringify(err)
    });
}
