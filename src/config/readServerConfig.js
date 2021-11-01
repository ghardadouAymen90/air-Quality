const fs = require('fs');

module.exports = class ServerConfig {

    constructor() {

        this.configFileName = 'aq_configFile.json';
        //this.env = process.env.AIRQUALITY_CONFIG_PATH || "D:/Myfiles/airQuality/src/config/";
        this.env = process.env.AIRQUALITY_CONFIG_PATH || "/airQuality-app/src/config/";
    }


    setGlobalParametersVariables_Prod() {
        let configFile;
        let environement;

        try {
            configFile = fs.readFileSync(this.env + this.configFileName);
        } catch (error) {
            let readPathError = 'Unreachable configuration file: ' + error;
            throw readPathError;
        }

        try {
            environement = JSON.parse(configFile);
        } catch (error) {
            let parseError = 'Parsing error in configuration file: ' + error;
            throw parseError;
        }

        global.globalParameters = new Map([
            ["db", environement.db], ["server", environement.server],
            ["logs", environement.logs], ["app", environement.app],
            ["swagger", environement.swagger],
            ["iqairData", environement.iqairData]
        ]);
    }

    setGlobalParametersVariables_Test() {
        const configFile = fs.readFileSync(this.env + this.configFileName);
        const environement = JSON.parse(configFile);
        const db = {
            url: "mongodb://aymen:aymen@localhost:27018/airQuality_TEST?replicaSet=rs0&serverSelectionTimeoutMS=5000"
        }

        const logs = {
            logPath: "./logsTest/",
            logLevel: "debug"
        }

        global.globalParameters = new Map([
            ["db", db], ["server", environement.server],
            ["logs", logs], ["app", environement.app],
            ["swagger", environement.swagger],
            ["iqairData", environement.iqairData]
        ]);
    }


    deleteGlobalParametersVariables_Test() {
        global.globalParameters = null;
    }

    handleError(server) {
        server.on('error', function onError(error) {
            throw error;
        }
        );
    }

    handleShutDown(winston, server) {
        // Gracefull shutdown
        global.isServerOnShutdown = false;
        const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        // The SIGINT signal is sent to a process by its controlling terminal typically initiated by pressing Ctrl + C
        // The SIGQUIT signal is sent to a process by its controlling terminal when the user requests that the process quit.  Ctrl + \
        // The SIGTERM is the signal that is typically used to administratively terminate a process, it allows the process to perform nice termination
        signals.forEach(sig => {
            //Receives a notification to stop
            process.on(sig, () => {
                global.isServerOnShutdown = true // to  force return status of 503 when the route \status is called
                winston.info(sig + ' signal received. Server will gracefully shutdown now!');
                server.getConnections((err, count) => {
                    winston.info("Connections Found on process " + process.pid + " : " + count);
                    // Stops the server from accepting new connections and finishes existing connections.
                    server.close(() => {
                        // close your database connection and exit with success 
                        global.globalConnection.close(() => {
                            global.globalConnection = null;
                            process.exit(0);
                        })
                    })
                })
            })
        })
    }
}
