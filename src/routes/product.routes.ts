import { Router } from "express";
import {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} from "../controllers/product.controller.ts";
import {createProductSchema,updateProductSchema,productIdSchema} from "../validation/product.validate.ts";
import {validate,validateParams} from "../middleware/product.middleware.ts";

const router = Router();

router.post("/",validate(createProductSchema),createProduct);
router.get("/",getAllProducts);
router.get("/:id",validateParams(productIdSchema),getProductById);
router.patch("/:id",validateParams(productIdSchema),validate(updateProductSchema),updateProduct);
router.delete("/:id",validateParams(productIdSchema),deleteProduct);

export default router;