import { Router } from "express";
import { noCallThru } from "proxyquire";
import { getRouterMock, getResponseSpyMock, getNextFunctionSpyMock } from "./express-router-test.helper";
import { IExpressRequest } from "../src/interfaces/IExpressRequest";

const proxyquire = noCallThru();

describe("a-json.route", () => {
	// import the file under test and mock its dependencies

	// prepare the exports object of the mocked dependency
	// this is empty now because it will be asigned different values per test
	const aJsonService: { 
		getAJson(): { [key: string]: string } | Error | null,
		saveAJson(): { [key: string]: string } | Error
	} = <any>{};

	class EntityManager { }

	const aJsonRoute: { setAJsonRoute(router: Router): Router } = proxyquire(
		"../src/routes/a-json.route",
		{
			"mikro-orm": { EntityManager },
			"../services/a-json.service": aJsonService
		}
	);

	const { router, routes } = getRouterMock();

	// build router; the routes will now contain all paths and their callbacks
	// all we have to do now is call the callbacks with the desired params to test behaviour
	beforeAll(() => aJsonRoute.setAJsonRoute(router));

	it("setAJsonRoute - router setup", () => {
		expect(routes["GET"]["/"]).toBeDefined("route GET / not setup");
		expect(typeof routes["GET"]["/"]).toBe("function", "route GET / not a function");
		expect(routes["POST"]["/"]).toBeDefined("route POST / not setup");
		expect(typeof routes["POST"]["/"]).toBe("function", "route POST / not a function");
	});

	// GET
	it("setAJsonRoute - GET / - exit point 1", async () => {
		const req = <IExpressRequest>{};
		const next = getNextFunctionSpyMock();

		await routes["GET"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(Error("EntityManager not available"));
	});
	it("setAJsonRoute - GET / - exit point 2", async () => {
		const err = Error("service mock error");
		const req = <IExpressRequest>{
			em: new EntityManager(),
			query: {}
		};
		const next = getNextFunctionSpyMock();
		aJsonService.getAJson = () => { throw err; };

		await routes["GET"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(err);
	});
	it("setAJsonRoute - GET / - exit point 3", async () => {
		const err = Error("service mock error");
		const req = <IExpressRequest>{
			em: new EntityManager(),
			query: {}
		};
		const next = getNextFunctionSpyMock();
		aJsonService.getAJson = () => err;

		await routes["GET"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(err);
	});
	it("setAJsonRoute - GET / - exit point 4", async () => {
		const req = <IExpressRequest>{
			em: new EntityManager(),
			query: {}
		};
		const res = getResponseSpyMock();
		aJsonService.getAJson = () => null;

		await routes["GET"]["/"](req, res, undefined);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.end).toHaveBeenCalled();
	});
	it("setAJsonRoute - GET / - exit point 5", async () => {
		const req = <IExpressRequest>{
			em: new EntityManager(),
			query: {}
		};
		const res = getResponseSpyMock();
		const json = { mockKey: "mock value" };
		aJsonService.getAJson = () => json;

		await routes["GET"]["/"](req, res, null);

		expect(res.json).toHaveBeenCalledWith(json);
	});

	// POST
	it("setAJsonRoute - POST / - exit point 1", async () => {
		const req = <IExpressRequest>{};
		const next = getNextFunctionSpyMock();

		await routes["POST"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(Error("EntityManager not available"));
	});

	it("setAJsonRoute - POST / - exit point 2", async () => { 
		const err = Error("service mock error");
		const req = <IExpressRequest>{
			em: new EntityManager(),
			body: {}
		};
		const next = getNextFunctionSpyMock();
		aJsonService.saveAJson = () => { throw err; };

		await routes["POST"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(err);
	});

	it("setAJsonRoute - POST / - exit point 3", async () => { 
		const err = Error("service mock error");
		const req = <IExpressRequest>{
			em: new EntityManager(),
			body: {}
		};
		const next = getNextFunctionSpyMock();
		aJsonService.saveAJson = () => err;

		await routes["POST"]["/"](req, undefined, next);

		expect(next).toHaveBeenCalledWith(err);
	});
	it("setAJsonRoute - POST / - exit point 4", async () => { 
		const req = <IExpressRequest>{
			em: new EntityManager(),
			body: {}
		};
		const res = getResponseSpyMock();
		const json = { mockKey: "mock value" };
		aJsonService.saveAJson = () => json;

		await routes["POST"]["/"](req, res, null);

		expect(res.json).toHaveBeenCalledWith(json);
	});
});