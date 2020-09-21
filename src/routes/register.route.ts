import { Router, Response, NextFunction } from "express";
import { EntityManager } from "mikro-orm";
import { IExpressRequest } from "../interfaces/IExpressRequest";
import * as userService from "../services/user.service";
import * as crypto from 'crypto-js'

export { setRegisterRoute };

function setRegisterRoute(router: Router): Router {
    router.post("/", register);

    return router;
}

function hashPassword(password: string) {
    // generating a random salt when creating user
    var salt = crypto.lib.WordArray.random(128).toString(crypto.enc.Hex);
    // a password-based key derivation function generating a hash using the password and the salt
    var hash = crypto.PBKDF2(password, salt, { keySize: 32, iterations: 10000 }).toString(crypto.enc.Hex);

    return { salt: salt, hash: hash, iterations: 10000 }
}

async function register(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let response: Error | { email: string };

    let saltAndHash = hashPassword(req.body.hash);

    let newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hash: saltAndHash.hash,
        salt: saltAndHash.salt
    }

    try {
        response = await userService.addUser(req.em, newUser);
    } catch (ex) {
        return next(ex);
    }

    if (response instanceof Error) {
        res.statusMessage = response.message
        return res.status(400).end();
    }

    return res.status(201).json(response);
}