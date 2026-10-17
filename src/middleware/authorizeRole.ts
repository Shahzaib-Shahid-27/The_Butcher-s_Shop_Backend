import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Please log in first", 401));
    }

    if (!('role' in req.user) ||typeof req.user.role !== "string" || !allowedRoles.includes(req.user.role) ) {
      return next(
        new AppError("Forbidden: You do not have permission", 403)
      );
    }

    next();
  };
};

export const authorizeAdmin = authorizeRole("ADMIN");