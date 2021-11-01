let ServerConfig = require('../config/readServerConfig');
let config = new ServerConfig();
config.setGlobalParametersVariables_Test();

const PollutionModel = require('./pollutionModel');
const errorparsing = require('../helpers/errorParsing');
const WinstonLogger = require('../logger/winstonLogger');
const InsertOneModel = require('./dbActions/insertOne/insertOne');
const FindOneModel = require('./dbActions/findOne/findOne');

const mockErrorParsing = jest.fn();
const mockWinstonLogger = jest.fn();
const mockInsertOne = jest.fn();
const mockFindOne = jest.fn();

jest.mock("../helpers/errorParsing", () => {
    return jest.fn().mockImplementation(() => {
        return {
        }
    });
});


jest.mock("../logger/winstonLogger", () => {
    return jest.fn().mockImplementation(() => {
        return {
        }
    });
});

jest.mock("../models/dbActions/InsertOne/insertOne", () => {
    return jest.fn().mockImplementation(() => {
        return {
            insertOne: mockInsertOne
        }
    });
});

jest.mock("../models/dbActions/findOne/findOne", () => {
    return jest.fn().mockImplementation(() => {
        return {
            findOne: mockFindOne
        }
    });
});


describe("PollutionModel Class", () => {
    const collection = "collectionName"

    beforeEach(() => {
        errorparsing.mockClear();
        mockErrorParsing.mockClear();
        WinstonLogger.mockClear();
        mockWinstonLogger.mockClear();
        InsertOneModel.mockClear();
        mockInsertOne.mockClear();
        FindOneModel.mockClear();
        mockFindOne.mockClear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Constructor of Polllution Class", () => {
        it('it should save the collectionName and the requestId in the attributs of the class', () => {
            let PollutionModelInit = new PollutionModel(collection);
            expect(PollutionModelInit.collectionName).toEqual(collection);
        });
    });

    describe("checkObject Method", () => {
        // Given
        const PollutionModelInit = new PollutionModel(collection);

        it("should return true if object is empty", () => {
            // Given
            const emptyObject = "";
            // When
            let result = PollutionModelInit.checkObject(emptyObject);

            expect(result).toEqual(true);
        });

        it("should return true if object is undefined", () => {
            // Given
            const undefinedObject = undefined;
            // When
            let result = PollutionModelInit.checkObject(undefinedObject);

            expect(result).toEqual(true);
        });

        it("should return true if object is null", () => {
            // Given
            const nullObject = null;
            // When
            let result = PollutionModelInit.checkObject(nullObject);

            expect(result).toEqual(true);
        });

        it("should return false if object is not empty and it is different to undefined and null", () => {
            // Given
            const validObject = { urid: "123dc4567ab10nj5" };
            // When
            let result = PollutionModelInit.checkObject(validObject);

            expect(result).toEqual(false);
        });
    });


    describe("savePollution Method", () => {
        it("Given the inputData and the outputData, the inputData should be formatted the same as the outputData", () => {

            let inputData = {
                "result": {
                    "pollution": {
                        "ts": "2019-08-04T01:00:00.000Z",
                        "aqius": 55,
                        "mainus": "p2",
                        "aqicn": 20,
                        "maincn": "p2"
                    }
                }
            };

            const formattedData = new PollutionModel(collection).savePollution(inputData);

            expect(formattedData.DATETIME).toBeDefined();
            expect(formattedData.ts).toBeDefined();
            expect(formattedData.ts).toEqual(inputData.result.pollution.ts);
            expect(formattedData.aqius).toBeDefined();
            expect(formattedData.aqius).toEqual(inputData.result.pollution.aqius);
            expect(formattedData.mainus).toBeDefined();
            expect(formattedData.mainus).toEqual(inputData.result.pollution.mainus);
            expect(formattedData.aqicn).toBeDefined();
            expect(formattedData.aqicn).toEqual(inputData.result.pollution.aqicn);
            expect(formattedData.maincn).toBeDefined();
            expect(formattedData.maincn).toEqual(inputData.result.pollution.maincn);
        });
    });


    describe("createPollutionInfo Method", () => {
        const PollutionModelInit = new PollutionModel(collection);

        it("should call the InsertOne method", async () => {

            const InsertOneFormatMethod = jest.spyOn(PollutionModelInit, "createPollutionInfo");
            let inputData = {
                "result": {
                    "pollution": {
                        "ts": "2019-08-04T01:00:00.000Z",
                        "aqius": 55,
                        "mainus": "p2",
                        "aqicn": 20,
                        "maincn": "p2"
                    }
                }
            };

            try {
                await PollutionModelInit.createPollutionInfo(inputData);
            } catch (err) {
                //console.log(err);
            }


            expect(InsertOneFormatMethod).toHaveBeenCalled();
            expect(InsertOneFormatMethod).toBeCalledTimes(1);
            expect(mockInsertOne).toHaveBeenCalled();
            expect(mockInsertOne).toBeCalledTimes(1);
            mockInsertOne.mockRestore();
        });
    });



    describe("getMostPollutedTime Method", () => {
        const PollutionModelInit = new PollutionModel(collection);

        it("should call the FindOne method", async () => {
            const FindOneFormatMethod = jest.spyOn(PollutionModelInit, "getMostPollutedTime");

            try {
                await PollutionModelInit.getMostPollutedTime();
            } catch (err) {
                //console.log(err);
            }

            expect(FindOneFormatMethod).toHaveBeenCalled();
            expect(FindOneFormatMethod).toBeCalledTimes(1);
            expect(mockFindOne).toHaveBeenCalled();
            expect(mockFindOne).toBeCalledTimes(1);
            mockFindOne.mockRestore();
        });
    });

});