const { env } = require("./env");
const { makeApp } = require("./app");
import * as https from "https";
import * as fs from "fs";

// import SSL certificate for HTTPS:
let privateKey = fs.readFileSync("src/ssl/backend.key");
let certificate = fs.readFileSync("src/ssl/backend.crt");

let app = makeApp()
let server = https.createServer({ key: privateKey, cert: certificate }, app);
console.log(`Server listening on port ${env.PORT}`)
server.listen(env.PORT)