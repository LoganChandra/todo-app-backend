import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";

// ROUTE HANDLERS
import { list } from "./routes/list";
import { add } from "./routes/add";
import { update } from "./routes/update";

export class TaskRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TaskRoutes");
  }

  configureRoutes() {

    // ROUTE CONFIG FOR LIST TASK
    this.app
      .route(`/task`)
      .get(async (req: express.Request, res: express.Response) => {
        await list(req, res);
      });

    // ROUTE CONFIG FOR ADD TASK
    this.app
      .route(`/task`)
      .post(async (req: express.Request, res: express.Response) => {
        await add(req, res);
      });

    // ROUTE CONFIG FOR UPDATE TASK
    this.app
      .route(`/task/:id`)
      .patch(async (req: express.Request, res: express.Response) => {
        await update(req, res);
      });
    return this.app;
  }
}
