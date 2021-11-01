let ServerConfig = require('../config/readServerConfig');
let config = new ServerConfig();
config.setGlobalParametersVariables_Test();

const responseError = require('../helpers/responseError');
jest.mock('../helpers/responseError');
jest.mock('../logger/winstonLogger');

const errorHandler = require('./notFoundHandler.js')

describe("404 Error Handler middlware", () => {

    let request = {
        url: '/v2/airquality/nearest_city',
        method: 'GET',
        correlationId: () => { return "a2254a35-e474-45bf-b3cb-78881e7406b2" },
        params: {},
        body: {},
        headers: {
        }
    };

    let response = { locals: { startDate: new Date() } };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call response error', () => {
        errorHandler(request, response, () => { });
        expect(responseError).toHaveBeenCalled();
    })
})