import { Router } from "express";
import { cartlineController } from "../controller/cartlineController.js";
import { authController } from "../controller/authController.js";

const routes = Router();

routes.get("/", authController.authorize, cartlineController.getRecords);
routes.get("/:id", authController.authorize, cartlineController.getRecord);
routes.post(
  "/",
  authController.authorize,
  authController.requireAdmin,
  cartlineController.createRecord,
);
routes.put(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  cartlineController.updateRecord,
);
routes.delete(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  cartlineController.deleteRecord,
);

export const cartlineRoutes = routes;
