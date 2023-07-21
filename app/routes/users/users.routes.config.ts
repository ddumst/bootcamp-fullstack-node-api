import express from "express";
import {
  CommonRoutesConfig,
  configureRoutes,
} from "@common/common.routes.config";
import { JwtMiddleware } from "@auth/middlewares/jwt.middleware";
import { UsersController } from "./controllers/users.controller";

export class UsersRoutes extends CommonRoutesConfig implements configureRoutes {
  constructor(app: express.Application) {
    super(app, "UsersRoute");
    this.configureRoutes();
  }

  configureRoutes() {
    const jwtMiddleware = JwtMiddleware.getInstance();
    const usersController = new UsersController();

    // DISCORD LOGIN
    this.app.post("/user/:userId/:imageType", [jwtMiddleware.validReqUser, usersController.upload]);
  }
}
