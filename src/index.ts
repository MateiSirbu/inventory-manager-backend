const { env } = require("./env");
const { makeApp } = require("./app");
const { log } = require("./log");
import * as https from "https";

makeApp()
    .then((app: https.Server) => app.listen(env.PORT, () => log(`${env.NODE_ENV} server listening on port ${env.PORT}`)))
    .catch((err: any) => log(err))