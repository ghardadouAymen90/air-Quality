const winston = require('../../../logger/winstonLogger');
const errorparsing = require('../../../helpers/errorParsing');


module.exports = class InsertOne {

    constructor(collectionName, query) {
        this.collectionName = collectionName;
        this.query = query;
    }


    insertOne() {
        return new Promise((resolve, reject) => {
            try {

                global.globalConnection.collection(this.collectionName)
                    .insertOne(this.query)
                    .then(({ acknowledged, insertedId }) => {
                        if (acknowledged && insertedId) {
                            winston.debug({ service: 'insertOne', collectionName: this.collectionName, message: 'mongodb insertOne - data inserted successfully' })
                            resolve(insertedId);
                        } else {
                            winston.debug({ service: 'insertOne', collectionName: this.collectionName, message: 'mongodb insertOne - response error' });
                            reject(errorparsing({ error_code: 500 }));
                        }
                    })
                    .catch((error) => {
                        winston.error(JSON.stringify(error));
                        winston.debug({ service: 'insertOne', collectionName: this.collectionName, message: 'mongodb insertOne - call catch, Check Query' });
                        reject(error.stack);
                    });
            }
            catch (err) {
                winston.error(JSON.stringify(err));
                winston.debug({ service: 'insertOne', collectionName: this.collectionName, message: 'mongodb insertOne - global catch, the try has failed' });
                reject(err.stack);
            }
        });
    }
}