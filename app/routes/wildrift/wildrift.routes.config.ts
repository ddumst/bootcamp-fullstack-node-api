import express from "express";
import {
  CommonRoutesConfig,
  configureRoutes,
} from "@common/common.routes.config";
import { WildRiftController } from "./controllers/wildrift.controller";

export class WildRiftRoutes extends CommonRoutesConfig implements configureRoutes {
  constructor(app: express.Application) {
    super(app, "WildRiftRoutes");
    this.configureRoutes();
  }

  configureRoutes() {
    const wildRiftController = new WildRiftController();

    this.app.get("/wildrift/champs", [wildRiftController.listChamps]);
    this.app.get("/wildrift/champs/:champId", [wildRiftController.getChampById]);

    this.app.put("/wildrift/champs/:champId", [wildRiftController.updateChampById]);
    this.app.delete("/wildrift/champs/:champId", [wildRiftController.deleteById]);
  }
}
