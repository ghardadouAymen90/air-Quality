
const InsertOne = require('./insertOne');
const errorparsing = require('../../../helpers/errorParsing');

jest.mock("../../../logger/winstonLogger", () => {
    return jest.fn().mockImplementation(() => {
        return {

        }
    });
});


describe("InsertOne Model", () => {
    const collection = "collection";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Constructor insertOne Class", () => {
        it('it should save the collection in the attribut of the class', () => {
            const InsertOneInit = new InsertOne(collection);
            expect(InsertOneInit.collectionName).toEqual(collection);
        });
    });

    describe("insertOne Method", () => {
        it("should called insertOne", async () => {

            const InsertOneInit = new InsertOne(collection);
            const spyInsertModel = jest.spyOn(InsertOneInit, "insertOne");

            try {
                await InsertOneInit.insertOne();
            } catch (error) {
                return error;
            }

            expect(spyInsertModel).toHaveBeenCalled();
            expect(spyInsertModel).toBeCalledTimes(1);
            spyInsertModel.mockRestore();
        });
    });
});



