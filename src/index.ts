const { env } = require("./env");
const { makeApp } = require("./app");
const { log } = require("./log");
import * as express from "express";

makeApp()
    .then((app: express.Application) => app.listen(env.PORT, () => log(`${env.NODE_ENV} server listening on port ${env.PORT}`)))
    .catch((err: any) => log(err))