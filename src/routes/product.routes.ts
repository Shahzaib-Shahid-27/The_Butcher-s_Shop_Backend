import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/authorizeRole.js";

const router = Router();

// Anyone can view products
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Only admins can change products
router.post("/", verifyJWT, authorizeAdmin, createProduct);
router.patch("/:id", verifyJWT, authorizeAdmin, updateProduct);
router.delete("/:id", verifyJWT, authorizeAdmin, deleteProduct);

export default router;