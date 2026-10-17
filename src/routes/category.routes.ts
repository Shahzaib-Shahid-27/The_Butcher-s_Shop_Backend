import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/authorizeRole.js";

const router = Router();

// Anyone can view categories
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Only authenticated admins can modify categories
router.post("/", verifyJWT, authorizeAdmin, createCategory);
router.patch("/:id", verifyJWT, authorizeAdmin, updateCategory);
router.delete("/:id", verifyJWT, authorizeAdmin, deleteCategory);

export default router;