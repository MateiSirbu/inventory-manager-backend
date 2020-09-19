import { Router, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import { EntityManager } from "mikro-orm";
import { IExpressRequest } from "../interfaces/IExpressRequest";
import * as userService from "../services/user.service";
import * as crypto from 'crypto-js'

export { setLoginRoute };

function setLoginRoute(router: Router): Router {
    router.post("/", login);

    return router;
}

function validateCredentials(user: User, password: string) {
    // a password-based key derivation function generating a hash using the password and the salt
    return user.hash == crypto.PBKDF2(password, user.salt, { iterations: 10000 }).toString(crypto.enc.Hex);
}

async function login(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let user: Error | User | null;
    try {
        user = await userService.getUser(req.em, req.body.email);
    } catch (ex) {
        return next(ex);
    }

    if (user instanceof Error) return next(user);

    if (user === null)
        res.sendStatus(404); // not found
    else {
        const RSA_PRIVATE_KEY = fs.readFileSync('src/ssl/jwtRS256.key');
        if (validateCredentials(user, req.body.password)) {
            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 120,
                subject: user.id
            })
            res.status(200).json({ // everything ok, returning token to client in request body
                idToken: jwtBearerToken,
                expiresIn: 120
            })
        }
        else {
            res.sendStatus(401); // unauthorized
        }
    }
}