import {CommonRoutesConfig, configureRoutes} from '../common/common.routes.config';
import {AuthController} from './controllers/auth.controller';
import {AuthMiddleware} from './middlewares/auth.middleware';
import {JwtMiddleware} from './middlewares/jwt.middleware';
import express from 'express';

export class AuthRoutes extends CommonRoutesConfig implements configureRoutes{
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
        this.configureRoutes();
    }

    configureRoutes() {
        const usersController = new AuthController();
        const jwtMiddleware = JwtMiddleware.getInstance();

        this.app.post(`/auth/refresh-token`, [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            usersController.createJWT
        ]);
    }


}