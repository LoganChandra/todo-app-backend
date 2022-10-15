import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";

// ROUTE HANDLERS
const { list } = require("./routes/list");
const { add } = require("./routes/add");
const { update } = require("./routes/update");

export class TaskRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TaskRoutes");
  }

  configureRoutes() {

    // ROUTE CONFIG FOR task/list
    this.app
      .route(`/task`)
      .get(async (req: express.Request, res: express.Response) => {
        await list(req, res);
      });

    // ROUTE CONFIG FOR task/add
    this.app
      .route(`/task`)
      .post(async (req: express.Request, res: express.Response) => {
        await add(req, res);
      });

    // ROUTE CONFIG FOR task/update
    this.app
      .route(`/task/:id`)
      .patch(async (req: express.Request, res: express.Response) => {
        await update(req, res);
      });
    return this.app;
  }
}
