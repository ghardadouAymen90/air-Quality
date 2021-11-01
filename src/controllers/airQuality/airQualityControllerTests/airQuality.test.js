let ServerConfig = require('../../../config/readServerConfig');
let config = new ServerConfig();
config.setGlobalParametersVariables_Test();

const express = require('express');
const _ = require('lodash');
const winstonLogger = require('../../../logger/winstonLogger');
const responseError = require('../../../helpers/responseError');
const responseTimeCalculator = require('../../../helpers/responseTimeCalculator');
const middlwaresBefore = require('../../../middlwares/middlwaresBefore');
const middlwaresAfter = require('../../../middlwares/middlwaresAfter');

const GetAirQuality = require('../getQuality');

const mockGetAirQuality = jest.fn();

jest.mock("../../../logger/winstonLogger", () => {
    return jest.fn().mockImplementation(() => {
        return {
        }
    });
});

jest.mock("../../../helpers/responseError", () => {
    return jest.fn().mockImplementation(() => {
        return {
        }
    });
});

jest.mock("../../../helpers/responseTimeCalculator", () => {
    return jest.fn().mockImplementation(() => {
        return {
        }
    });
});

jest.mock("../../../models/pollutionModel", () => {
    return jest.fn().mockImplementation(() => {
        return {
            getAirQuality: mockGetAirQuality
        }
    });
});

describe("getAirQuality Controller", () => {

    const request = {
        originalUrl: '/v2/airquality/nearest_city',
        correlationId: () => { return "a2254a35-e474-45bf-b3cb-78881e7406b2" },
        headers: [],
    }
    const response = {
        locals: {
            startDate: new Date()
        }
    }

    beforeEach(() => {
        const app = express();

        middlwaresBefore(app);
        middlwaresAfter(app);

        winstonLogger.mockClear();
        responseError.mockClear();
        responseTimeCalculator.mockClear();
        mockGetAirQuality.mockClear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Constructor of airQuality Controller", () => {
        it('it should save the request and the result in the attributs of the class and define the of attributes', () => {

            let getAirQualityInstance = new GetAirQuality(request, response);

            expect(getAirQualityInstance.req).toEqual(request);
            expect(getAirQualityInstance.res).toEqual(response);
            expect(getAirQualityInstance.requestId).toEqual("a2254a35-e474-45bf-b3cb-78881e7406b2");
            expect(getAirQualityInstance.start).toBeDefined();
            expect(getAirQualityInstance.client).toBeDefined();
        });
    });

    describe("errorFormatting Method", () => {
        let getAirQualityInstance = new GetAirQuality(request, response);

        it("should called responseError", () => {
            getAirQualityInstance.errorFormatting(28, 400);
            expect(responseError).toHaveBeenCalled();
        });

    });


    describe("getQuality Method", () => {
        it("should called errorFormatting Method if parameters are incorrect", async () => {
            request.query = { "lon": false };
            getAirQualityInstance = new GetAirQuality(request, response);
            const spyErrorFormatting = jest.spyOn(getAirQualityInstance, "errorFormatting");

            await getAirQualityInstance.getQuality();
            expect(spyErrorFormatting).toHaveBeenCalled();
        });

        it("should pass if parameters are correct", async () => {
            request.query = {};
            getAirQualityInstance = new GetAirQuality(request, response);

            try {
                await getAirQualityInstance.getQuality();
            } catch (error) {
                return error;
            }

            expect(mockGetAirQuality).toHaveBeenCalled();
        });

    });

});
