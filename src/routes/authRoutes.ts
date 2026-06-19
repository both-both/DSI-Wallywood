import { Router } from "express";
import { authController } from "../controller/authController.js";

const router = Router();

router.post("/", authController.authenticate);

export { router as authRoutes };
