import { Router } from "express";
import { userRatingController } from "../controller/userRatingController.js";
import { authController } from "../controller/authController.js";

const routes = Router();

routes.get("/", authController.authorize, userRatingController.getRecords);
routes.get("/:id", authController.authorize, userRatingController.getRecord);
routes.post(
  "/",
  authController.authorize,
  authController.requireAdmin,
  userRatingController.createRecord,
);
routes.put(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  userRatingController.updateRecord,
);
routes.delete(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  userRatingController.deleteRecord,
);

export const userRatingRoutes = routes;
