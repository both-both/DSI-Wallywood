import { Router } from "express";
import { genreController } from "../controller/genreController.js";
import { authController } from "../controller/authController.js";

const routes = Router();

routes.get("/", authController.authorize, genreController.getRecords);
routes.get("/:id", authController.authorize, genreController.getRecord);
routes.post(
  "/",
  authController.authorize,
  authController.requireAdmin,
  genreController.createRecord,
);
routes.put(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  genreController.updateRecord,
);
routes.delete(
  "/:id",
  authController.authorize,
  authController.requireAdmin,
  genreController.deleteRecord,
);

export const genreRoutes = routes;
