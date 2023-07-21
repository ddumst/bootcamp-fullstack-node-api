import {CommonRoutesConfig, configureRoutes} from '../common/common.routes.config';
import express from 'express';

export class AuthRoutes extends CommonRoutesConfig implements configureRoutes{
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
        this.configureRoutes();
    }

    configureRoutes() {}
}