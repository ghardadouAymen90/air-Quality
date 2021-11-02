# air-Quality G1R0C0
a REST API responsible for exposing information on the air quality of a nearest city to GPS coordinates using iqair <br/>

## Requirements

For development, you will need Node.js(npm installed within), mongoDriver(start mongod with replicaset named rs0) and nodemon installed in your environment. <br/>

## ENV variables
You have to move the file /src/config/aq_configFile.json to a nown secured location. <br/>
You have to configure an env variable named "AIRQUALITY_CONFIG_PATH", that contains the path to the aq_configFile.json file. .<br/>

## configuration file
```JSON
{
    "db": {
        "url": "mongodb://localhost:27018/airQuality?replicaSet=rs0",   // url of the db replicaSet
        "dbName": "airQuality",                                         // minimum poolSize for the mongo connection
        "dbPoolSize": 20
    },
    "logs": {
        "logPath": "/logs",                                             // path to logs
        "logLevel": "debug",                                            // logs type, it can be debug, info or info.
        "datePattern": "YYYY-MM-DD-HH",                                 // rotation of logs per hour, "YYYY-MM-DD" to configure rotation per day.
        "maxFiles": "1d",                                               // keep logs for only one day
        "maxSize": "1g"                                                 // max size of log file       
    },
    "server": {
        "port": "8081"                                                  // server port if not configured in env
    },
    "swagger": {
        "host": "localhost:8081"                                        // host of swagger
    },
    "iqairData": {                                                      //iqair data
        "apiKey": "7f2a55b4-7c1a-4a70-83cf-1ca09cdc8a1a",                
        "url": "http://api.airvisual.com",
        "desiredCoordinates": {
            "paris": {
                "LONGITUDE": "2.352222",
                "LATITUDE": "48.856613"
            }
        }
    }
}
```

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

To access swagger, open your web browser after starting the projet with npm run dev.<br/>
type this url : http://localhost:8081/swagger-ui/#/<br/>
the swagger ui will load and you will have access to the apis<br/>
Note : swagger is hosted in localhost in developement mode (congigured in the config file)<br/>

## Summary
this api will give you the possiblity to get pollution's data for the nearest city's GPS coordinates<br/>
It runs a cron job every minutes, to get Paris pollution's data<br/>
It gives you access to the most polluted and nearest time in Paris<br/>
It gives you an api to check the status of the server<br/>
It provides logs and log rotation<br/>
It provides a swagger ui to manipulate the api<br/>
It has a Dockerfile and docker-compose file to containerize the application<br/>
It has a vagrant file to run a VM based on ubuntu 18.04 image<br/>
It has added middlwares to ensure some security of the api<br/>

## log example
```JSON
{
    "timestamp":"2021-11-02T12:49:00.649Z",
    "component":"airQuality",
    "level":"INFO","requestId":"1c879e63-f249-4101-9809-aaa6955bb572",
    "url":"/v2/airquality/nearest_city?&lat=48.856613&lon=2.352222",
    "host":"localhost",
    "statusCode":200,
    "start":"2021-11-02T12:49:00.649Z",
    "service":"GET",
    "resource":"airQuality",
    "responseTime":"738.70ms"
    }
```


## Note
**It is required to create indexes in the db** .<br/>
Under airQuality DB, you will find a collection named pollution_paris .<br/>
tap these two commands in the mongoShell terminal : <br/>

   $ db.pollution_paris.createIndex({"DATETIME":-1})
   
   $ db.pollution_paris.createIndex({aqius:1})