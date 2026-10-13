import { Router } from "express";
import {createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory,} from "../controllers/category.controller.ts";
import { createCategorySchema,updateCategorySchema,categoryIdSchema,} from "../validation/category.validate.ts";
import {validate,validateParams,} from "../middleware/product.middleware.ts";

const router = Router();

// CREATE
router.post("/",validate(createCategorySchema),createCategory);

// GET ALL
router.get("/",getAllCategories);

// GET BY ID
router.get("/:id",validateParams(categoryIdSchema),getCategoryById);

// UPDATE
router.patch("/:id",validateParams(categoryIdSchema),validate(updateCategorySchema),updateCategory);

// DELETE
router.delete("/:id",validateParams(categoryIdSchema),  deleteCategory);

export default router;