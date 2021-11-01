
const FindOne = require('./findOne');

jest.mock("../../../logger/winstonLogger", () => {
    return jest.fn().mockImplementation(() => {
        return {

        }
    });
});


describe("FindOne Model", () => {
    const collection = "collection";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Constructor findOne Class", () => {
        it('it should save the collection namein the attribut of the class', () => {
            const FindOneInit = new FindOne(collection);
            expect(FindOneInit.collection).toEqual(collection);
        });
    });

    describe("findOne Method", () => {

        it("should call findOne method", async () => {

            const FindOneInit = new FindOne(collection);
            const spyFindModel = jest.spyOn(FindOneInit, "findOne");

            try {
                await FindOneInit.findOne();
            } catch (error) {
                return error;
            }

            expect(spyFindModel).toHaveBeenCalled();
            expect(spyFindModel).toBeCalledTimes(1);
            spyFindModel.mockRestore();
        });
    });
});



