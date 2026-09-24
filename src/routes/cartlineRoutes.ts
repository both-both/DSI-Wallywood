import { Router } from "express";
import { cartlineController } from "../controller/cartlineController.js";
import { authController } from "../controller/authController.js";

const routes = Router();

routes.get("/", cartlineController.getRecords);
routes.get("/:id", cartlineController.getRecord);
routes.post("/", cartlineController.createRecord);
routes.put("/:id", cartlineController.updateRecord);
routes.delete("/:id", cartlineController.deleteRecord);

export const cartlineRoutes = routes;
