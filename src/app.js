// call config
let ServerConfig = require('./config/readServerConfig');
let config = new ServerConfig();
config.setGlobalParametersVariables_Prod();

// call nodejs modules
const http = require('http');
//const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const winston = require("./logger/winstonLogger");

// Import costum modules
const middlwaresBeforeRoutes = require('./middlwares/middlwaresBefore');
const middlwaresAfterRoutes = require('./middlwares/middlwaresAfter');
const SwaggerConfig = require('./swagger/config');
const Router = require('./routers/router');
const connexion = require('./models/dbActions/Connection/connexion');

//Env variables
process.env.NODE_ENV = "production";
process.env.UV_THREADPOOL_SIZE = 32;


//cluster call      // cluster for industrial purpose: I tested with it and then decided to comment the code to simplify the app behavor, especcailly when running the cron job.
/* if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        //winston.debug(`worker ${worker.process.pid} died with signal ${signal} on code ${code}`);
    });
} else { */

//connection
let url = global.globalParameters.get("db").url;
let dbName = global.globalParameters.get("db").dbName;

let reconnectAlways = () => {
    new connexion(url, dbName)
        .connect()
        .then(() => { })
        .catch(err => { });
}
reconnectAlways();

// Express Instance
let app = express();

// swagger config api
let swagger = new SwaggerConfig();

// call middlwares before routes
middlwaresBeforeRoutes(app);

// call swagger
swagger.config(app);

// router call
new Router(app).methodsCaller();

// call middlwares after routes
middlwaresAfterRoutes(app);

// create server
let port = (process.env.PORT || global.globalParameters.get("server").port);
let server = http.createServer(app);

// event handlers
config.handleError(winston, server);
config.handleShutDown(winston, server);

// server on linstening
server.listen(port);
winston.info('Server listening on port ' + port);

// }
