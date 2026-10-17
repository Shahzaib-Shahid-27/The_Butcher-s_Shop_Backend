import jwt, { type JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import AppError from "../utils/AppError.js";
import * as authRepository from "../repositories/auth.repo.js";

// Extend Express Request interface to include the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        exp?: number;
      };
    }
  }
}
export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError("Unauthorized: No token provided", 401)
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const secret = process.env.ACCESS_TOKEN_SECRET;

      if (!secret) {
        throw new Error(
          "ACCESS_TOKEN_SECRET is not defined in environment variables"
        );
      }

      // Verify the access token
      const decoded = jwt.verify(token, secret) as JwtPayload & {
        userId: string;
      };

      if (!decoded.userId) {
        return next(
          new AppError("Unauthorized: Invalid token payload", 401)
        );
      }

      // Fetch the user from the database
      const user = await authRepository.findUserById(decoded.userId);

      if (!user) {
        return next(
          new AppError("User account not found.", 401)
        );
      }

      // Attach the current database role to the request
      const authenticatedUser = {
        userId: user.id,
        role: user.role,
        exp: decoded.exp,
      };
      req.user = authenticatedUser;

      return next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          return next(
            new AppError("Unauthorized: Access token expired", 401)
          );
        }

        if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
          return next(
            new AppError("Unauthorized: Invalid access token", 401)
          );
        }

        // Don't disguise database or configuration errors as invalid tokens
        return next(err);
      }

      return next(
        new AppError("Unauthorized: Unknown error", 401)
      );
    }
  }
);