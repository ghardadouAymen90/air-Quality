const express = require('express'); // 3rd party
const path = require('path'); // built in

const errorhandler = require('./errorHandlerMiddlware');
const notFoundhandler = require('./notFoundHandler');

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, 'public'))); // redirect to dirname/public for static files for client requests

    //disable x-powered-by
    app.disable('x-powered-by'); // hide infos

    // error handler
    app.use(errorhandler);

    // catch 404 and forward to error handler
    app.use(notFoundhandler);

};
