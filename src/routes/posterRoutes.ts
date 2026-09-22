import { Router } from "express";
import { posterController } from "../controller/posterController.js";
import { authController } from "../controller/authController.js";

const routes = Router();

routes.get("/", posterController.getRecords);
routes.get("/:id", posterController.getRecord);

routes.post(
  "/",
  authController.authorize,
  authController.requireAdmin,
  posterController.createRecord,
);
routes.put(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  posterController.updateRecord,
);
routes.delete(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  posterController.deleteRecord,
);

export const posterRoutes = routes;
