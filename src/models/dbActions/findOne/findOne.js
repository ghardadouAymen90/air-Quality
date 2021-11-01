const winston = require('../../../logger/winstonLogger');

module.exports = class FindOne {

    constructor(collection) {
        this.collection = collection;
    }


    findOne() {
        return new Promise((resolve, reject) => {
            try {
                let myCollection = global.globalConnection.collection(this.collection);

                myCollection
                    .find({})
                    .sort({ "DATETIME": -1, "aqius": 1 })
                    .toArray()
                    .then(foundDoc => {
                        if (!foundDoc) {
                            winston.debug('Mongodb find one - no datas found');
                            resolve({});
                        }
                        else {
                            resolve(foundDoc[0]);
                            winston.debug('Mongodb find one - data found successfully');
                        }
                    })
                    .catch((error) => {
                        winston.error(JSON.stringify(error));
                        winston.debug('Mongodb find one - call catch');
                        reject(error.stack);
                    })
            }
            catch (error) {
                winston.error(JSON.stringify(error));
                winston.debug('Mongodb find one - Global catch');
                reject(error.stack);
            }
        })

    }



}