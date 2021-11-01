
const axios = require('axios').default;
const winston = require('../../logger/winstonLogger');
const cron = require('node-cron');

const PollutionModel = require('../../models/pollutionModel');

const iqairData = global.globalParameters.get("iqairData");
const port = (process.env.PORT || global.globalParameters.get("server").port);

module.exports = function () {


    const baseUrl = `http://localhost:${port}`; // an internal call for the get pullution data route. Eventually, it's gonna always be called from inside a container internally, so localhost will always work.
    winston.info('Cron Job for getting paris pollution\'s data has started');
    const { LONGITUDE, LATITUDE } = iqairData.desiredCoordinates.paris;
    cron.schedule('* * * * *', () => {
        const longitude = `&lon=${LONGITUDE}`;
        const latitude = `&lat=${LATITUDE}`;

        axios.get(`${baseUrl}/v2/airquality/nearest_city?${latitude}${longitude}`)
            .then(response => {
                new PollutionModel('pollution_paris').createPollutionInfo(response.data)
                    .then(() => winston.debug('Getting Paris\'s pollution data -  done'))
                    .catch(() => winston.debug('Getting Paris\'s pollution data -  error'))

                winston.debug('Getting Paris\'s pollution data');

            })
            .catch(err => {
                winston.error('scheduled get of airQuality - failed');
                winston.error(err);
            })
    });
}