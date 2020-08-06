import * as proxyquire from "proxyquire"

describe("a-json-data", () => {
	describe("getAJson", () => {
		// "./a-json.data" is the file that we're testing; it should be imported as reference, but we need to mock its dependencies
		// "../models/a-json.model" is a dependency of the file we're testing, and its export is aJsonModel function and AJsonModel class
		// instead of require("./a-json.data") or import ... from "./a-json.data", we use proxyquire("file", mocks)
		const aJsonData: { getAJson(): { [key: string]: string } } = proxyquire(
			"../src/data/a-json.data",
			{
				"../models/a-json.model": {
					aJsonModel: () => ({ key1: "value 1" }),
					AJsonModel: class AJsonModelMock {
						key1: any;
						constructor() { this.key1 = "value 1"; }
					}
				}
			}
		);

		let theData: any;

		// runs before each 'it' in this 'describe' block; there is also a beforeAll hook available
		beforeEach(() => theData = aJsonData.getAJson());

		// runs after each 'it' in this 'describe' block; there is also a afterAll hook available
		afterEach(() => theData = undefined);

		it("should get some data", () => expect(theData).toBeDefined("theData was not set"));
		it("should contain key1", () => expect((<any>theData).key1).toBeDefined("theData does not contain key1"));
		it("key1 should be 'value 1'", () => expect((<any>theData).key1).toBe("value 1", "theData does not contain key1"));
		it("should not contain key 'nonExistingModelProp'",
			() => expect((<any>theData).nonExistingModelProp).not.toBeDefined("theData contains key nonExistingModelProp"));
	});
});
