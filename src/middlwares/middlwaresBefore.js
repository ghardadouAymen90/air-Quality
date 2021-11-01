const correlator = require('express-correlation-id'); // 3rd party
const helmet = require('helmet'); // 3rd party
const sanitizer = require('sanitize'); // 3rd party
const express = require('express'); // 3rd party
const cors = require('cors');
const sixtyDaysInSeconds = 5184000;

module.exports = (app) => {

    app.use((req, res, next) => {
        res.locals.hrTimeStart = process.hrtime(); // pour le calcul de temps de réponse
        res.locals.startDate = new Date(); // pour loguer le temps de réception de la requête
        next();
    });


    app.use(express.json()); //Used to parse JSON bodies instead of body-parser
    app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
    app.use(helmet()); // 3rd party that sets HTTP response headers for security reasons
    app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));
    app.use(correlator()); // ID correlation from request
    app.use(sanitizer.middleware); // protect from No sql injection  + provided access to params in request url
    app.use(cors());
};