# air-Quality G1R0C0
a REST API responsible for exposing information on the air quality of a nearest city to GPS coordinates using iqair 

## Requirements

For development, you will need Node.js(npm installed within), mongoDriver(start mongod with replicaset named rs0) and nodemon installed in your environment.

## ENV variables
You have to move the file /src/config/aq_configFile.json to a nown secured location.
You have to configure an env variable named "AIRQUALITY_CONFIG_PATH", that contains the path to the aq_configFile.json file.

## configuration file
{<br />
    "db": {<br />
        "url": "mongodb://localhost:27018/airQuality?replicaSet=rs0",   // url of the db replicaSet<br />
        "dbName": "airQuality",                                         // minimum poolSize for the mongo connection<br />
        "dbPoolSize": 20<br />
    },<br />
    "logs": {<br />
        "logPath": "/logs",                                             // path to logs<br />
        "logLevel": "debug",                                            // logs type, it can be debug, info or info.<br />
        "datePattern": "YYYY-MM-DD-HH",                                 // rotation of logs per hour, "YYYY-MM-DD" to configure rotation per day.<br />
        "maxFiles": "1d",                                               // keep logs for only one day<br />
        "maxSize": "1g"                                                 // max size of log file    <br />   
    },<br />
    "server": {<br />
        "port": "8081"                                                  // server port if not configured in env<br />
    },
    "swagger": {<br />
        "host": "localhost:8081"                                        // host of swagger<br />
    },<br />
    "iqairData": {                                                      //iqair data<br />
        "apiKey": "7f2a55b4-7c1a-4a70-83cf-1ca09cdc8a1a",  <br />              
        "url": "http://api.airvisual.com",<br />
        "desiredCoordinates": {<br />
            "paris": {<br />
                "LONGITUDE": "2.352222",<br />
                "LATITUDE": "48.856613"<br />
            }<br />
        }<br />
    }<br />
}<br />


## Install

    $ git clone https://github.com/ghardadouAymen90/air-Quality.git
    $ cd air-Quality
    $ git checkout local
    $ npm install

## DB preparation 


## Running the project in development

    $ npm run dev

## Running the project in production

    $ npm start

## Running the tests in this project with jest and getting coverage reports

    $ npm run test

## swagger documentation

To access swagger, open your web browser after starting the projet with npm run dev.
type this url : http://localhost:8081/swagger-ui/#/
the swagger ui will load and you will have access to the apis
Note : swagger is hosted in localhost in developement mode (congigured in the config file)

## Summary
this api will give you the possiblity to get pollution's data for the nearest city's GPS coordinates
It runs a cron job every minutes, to get Paris pollution's data
It gives you access to the most polluted and nearest time in Paris
It gives you an api to check the status of the server
It provides logs and log rotation
It provides a swagger ui to manipulate the api
It has a Dockerfile and docker-compose file to containerize the application
It has a vagrant file to run a VM based on ubuntu 18.04 image
It has added middlwares to ensure some security of the api

## log example
{"timestamp":"2021-11-02T12:49:00.649Z", "component":"airQuality", "level":"INFO", "requestId":"1c879e63-f249-4101-9809-aaa6955bb572", "url":"/v2/airquality/nearest_city?&lat=48.856613&lon=2.352222","host":"localhost","statusCode":200,"start":"2021-11-02T12:49:00.649Z","service":"GET","resource":"airQuality","responseTime":"738.70ms"}
