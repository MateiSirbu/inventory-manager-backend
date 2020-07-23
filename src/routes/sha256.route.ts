import * as express from "express"
import * as bodyParser from 'body-parser'
import * as cryptoJS from 'crypto-js'

const sha256Router = express.Router();

// create application/json parser (required as of July 2020, run npm install body-parser)
// check this: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
var jsonParser = bodyParser.json()

let sha256func = function (req: express.Request, res: express.Response) {
    let text: string = req.body.text // get "text" from json data of POST request
    return res.end(`Your text: ${text}\nSHA256 hash: ${cryptoJS.SHA256(text)}`)
}

sha256Router.post("/", jsonParser, sha256func);

export { sha256Router }