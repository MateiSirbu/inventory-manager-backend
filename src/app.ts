import * as express from "express";
import * as fs from "fs";
import * as https from "https";
import { IExpressError } from "./interfaces/IExpressError";
import { env } from "./env";
import { discoveryClientRouter } from "./routes/discovery-client.route";
import { aJsonRouter } from "./routes/a-json.route";
import { sha256Router } from "./routes/sha256.route";

let app: express.Application;

const makeApp = function () {
	if (app) return app;

	app = express();

	// routes 
	app.use(env.DISCOVERY_CLIENT_ROUTE, discoveryClientRouter);
	app.use(env.A_JSON_ROUTE, aJsonRouter);
	app.use(env.SHA256_ROUTE, sha256Router);

	// 404
	app.use((_req, _res, next) => {
		const err = new Error("Not Found") as IExpressError;
		err.status = 404;
		next(err);
	});

	// 500
	app.use((err: IExpressError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		res.status(err.status || 500)
			.send(env.NODE_ENV === "development" ? err : {});
	});

	let privateKey = fs.readFileSync("src/ssl/mydomain.key");
	let certificate = fs.readFileSync("src/ssl/mydomain.crt");
	let credentials = {
		key: privateKey,
		cert: certificate
	};

	return https.createServer(credentials, app);
}

export { makeApp }