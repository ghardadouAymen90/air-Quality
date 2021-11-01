const _ = require('lodash');
const winston = require('../logger/winstonLogger');

const InsertOne = require('./dbActions/insertOne/insertOne');
const FindOne = require('./dbActions/findOne/findOne');



module.exports = class AirPollution {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }


    // Check the returned Object and return true if it's not valide!
    checkObject(obj) {
        return _.isEmpty(obj) || _.isUndefined(obj) || _.isNull(obj);
    }


    //Formating the pollution data as required before insert
    savePollution(data) {
        const pollution = data.result.pollution;
        return { "DATETIME": new Date().toISOString(), ...pollution };
    }

    // insert polution data
    createPollutionInfo(insertData) {
        return new Promise((resolve, reject) => {
            let pollutionData = this.savePollution(insertData);

            new InsertOne(this.collectionName, pollutionData)
                .insertOne()
                .then(() => {
                    resolve();
                    winston.debug('pollution created - done successfully');
                })
                .catch((error) => {
                    reject(error);
                    winston.debug('pollution creation - Catch');
                });
        })
    }

    // Get the datetime when the pollution is the biggest
    getMostPollutedTime() {
        return new Promise((resolve, reject) => {

            new FindOne(this.collectionName)
                .findOne()
                .then(mostPolluted => {
                    if (this.checkObject(mostPolluted)) {
                        resolve({});
                        winston.debug('get Most Polluted Time - not found');
                    } else {
                        resolve({ "DATETIME": mostPolluted.DATETIME });
                        winston.debug('get Most Polluted Time- found');
                    }
                })
                .catch((err) => {
                    winston.debug('get Most Polluted Time- Catch');
                    reject(err);
                });
        });
    }
}