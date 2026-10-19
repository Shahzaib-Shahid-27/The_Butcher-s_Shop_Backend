import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as authController from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/forgot-password", asyncHandler(authController.forgotPassword));
authRouter.post("/reset-password", asyncHandler(authController.resetPassword));
authRouter.post("/refresh", asyncHandler(authController.refreshToken));
authRouter.post("/logout", verifyJWT, asyncHandler(authController.logout));
authRouter.get("/get-profile",verifyJWT,asyncHandler(async (req, res) => {await authController.getProfile(req, res);}),);
authRouter.get("/google", asyncHandler(authController.googleRedirect));
authRouter.get("/google/callback", asyncHandler(authController.googleCallback));

export default authRouter;