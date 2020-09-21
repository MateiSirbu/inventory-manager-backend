import { Router, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import * as jwt from 'jsonwebtoken';
import * as expressjwt from "express-jwt"
import * as fs from "fs";
import { EntityManager } from "mikro-orm";
import { IExpressRequest } from "../interfaces/IExpressRequest";
import * as userService from "../services/user.service";
import * as crypto from 'crypto-js'
import { env } from "../env";
import * as jwt_decode from "jwt-decode"

export { setLoginRoute };

function setLoginRoute(router: Router): Router {
    router.post("/", login);
    router.post("/userinfo", jwtVerify, getUserInfoFromToken);
    return router;
}

function validateCredentials(user: User, password: string) {
    // a password-based key derivation function generating a hash using the password and the salt
    return user.hash == crypto.PBKDF2(password, user.salt, { keySize: 32, iterations: 10000 }).toString(crypto.enc.Hex);
}

async function login(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let user: Error | User | null;
    try {
        user = await userService.getUserByEmail(req.em, req.body.email);
    } catch (ex) {
        return next(ex);
    }

    if (user instanceof Error) return next(user);

    if (user === null)
        res.sendStatus(404); // e-mail not found
    else {
        const privateKey = fs.readFileSync(env.RSA_PRIVATE_KEY);
        if (validateCredentials(user, req.body.password)) {
            const jwtToken = jwt.sign({}, privateKey, { algorithm: 'RS256', expiresIn: 86400, subject: user.id })
            res.status(200).json({ // everything ok, returning token to client in response body
                idToken: jwtToken,
                expiresIn: 86400
            })
        }
        else {
            res.sendStatus(401); // unauthorized
        }
    }
}

// JWT verification using the public key
const jwtVerify = expressjwt({
    secret: fs.readFileSync(env.RSA_PUBLIC_KEY),
    algorithms: ['RS256'],
    getToken: function fromReqBody(req) {
        return req.body.idToken;
    }
})

async function getUserInfoFromToken(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let user: Error | User | null = null;
    let idToken = req.body.idToken;

    let decoded: any = jwt_decode(idToken);
    let userId = decoded.sub;

    try {
        user = await userService.getUserById(req.em, userId);
    } catch (ex) {
        return next(ex);
    }

    if (user instanceof Error || user === null) return res.sendStatus(401);

    return res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
}