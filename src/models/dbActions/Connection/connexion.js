const mongodb = require('mongodb');
const winston = require('../../../logger/winstonLogger');
const getParisAirQualityData = require('../../../cronJob/parisQuality/cronJob');
let minPoolSize = global.globalParameters.get("db").dbPoolSize;

module.exports = class Connection {

    constructor(url, dbName) {
        if (!url) { return new Error('Database url cannot be null or undefined') }
        if (!dbName) { return new Error('Database name cannot be null or undefined') }
        this.url = url;
        this.dbName = dbName;
    }

    connect() {
        try {
            let mongoClient = new mongodb.MongoClient(this.url, { minPoolSize, useUnifiedTopology: true, useNewUrlParser: true });

            return new Promise((resolve, reject) => {

                if (!!global.globalConnection && global.globalConnection.topology.isConnected()) {
                    resolve(global.globalClient);
                } else {
                    mongoClient
                        .connect((error, client) => {
                            if (error) {
                                // if (global.globalConnection) global.globalClient.close();
                                console.log(error)
                                winston.error("Error establishing a database connection");
                                winston.error(JSON.stringify(error));
                                global.globalConnection = null;
                                reject({
                                    error_code: 500,
                                    message: "Error establishing a database connection"
                                });
                                this.connect().then(() => { }).catch(() => { });
                            }
                            else {
                                winston.info("Connected successfully to MongoDB server");
                                global.globalConnection = client.db(this.dbName);
                                global.globalClient = client;
                                winston.debug("New database connection is established");
                                getParisAirQualityData();
                                resolve(client);
                            }
                        })
                }

            })
        } catch (error) {
            winston.error(JSON.stringify('*****' + error));
        }
    }
}
