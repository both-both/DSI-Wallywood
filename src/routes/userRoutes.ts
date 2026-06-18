import { Router } from "express";
import { getRecords } from "../controller/userController.js";

const routes = Router();

routes.get("/users", getRecords);

routes.get("/users/:id", (req, res) => {
  res.send(`Bruger ID er ${req.params.id}`);
});

export const userRoutes = routes;
