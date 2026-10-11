import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.post("/reset-password", authController.resetPassword);

authRouter.post("/refresh", authController.refreshToken);

authRouter.post("/logout", verifyJWT, authController.logout);

authRouter.get("/get-profile", verifyJWT, authController.getProfile);

export default authRouter;