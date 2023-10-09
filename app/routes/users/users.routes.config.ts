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

    // Hasura Actions Endpoints
    this.app.get("/user-games", [usersController.getUserGames]);
    this.app.post("/user-games/create", [jwtMiddleware.validReqUser, usersController.createUserGame]);
    this.app.patch("/user-games/update", [jwtMiddleware.validReqUser, usersController.updateUserGame]);


    this.app.post("/user/:userId/youtube", [jwtMiddleware.validReqUser, usersController.saveYoutubeChannel]);
    this.app.post("/user/:userId/:imageType", [jwtMiddleware.validReqUser, usersController.upload]);
    this.app.post("/upload/:fileType", [jwtMiddleware.validReqUser, usersController.uploadFile]);
    this.app.post("/uploads", [jwtMiddleware.validReqUser, usersController.uploadFiles]);

    this.app.get("/youtube/:channelId", [usersController.getYoutubeVideos]);

    this.app.post("/manager/discord/roles/:roleId", [usersController.claimBadgeFromDiscordRoleId]);
  }
}
