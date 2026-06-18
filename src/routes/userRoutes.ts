import { Router } from "express";
import { userController } from "../controller/userController.js";

const routes = Router();

routes.get("/", userController.getRecords);
routes.get("/:id", userController.getRecord);
routes.post("/", userController.createRecord);
routes.put("/:id", userController.updateRecord);
routes.delete("/:id", userController.deleteRecord);

export const userRoutes = routes;
