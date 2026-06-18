import { Router } from "express";

const routes = Router();

routes.get("/", () => console.log("testRouter"));

export const testRoutes = routes;
