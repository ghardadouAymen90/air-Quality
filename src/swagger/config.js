const swaggerUi = require('swagger-ui-express');

module.exports = class swaggerConfig {

    config(app) {

        const swagger = require('./swagger.json');
        swagger.host = global.globalParameters.get("swagger").host;

        app.use('/swagger-ui', swaggerUi.serve, (req, res) => {
            res.status(200).send(swaggerUi.generateHTML(swagger));
        });

    }
}