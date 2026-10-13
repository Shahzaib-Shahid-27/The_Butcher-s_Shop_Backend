import { Router } from "express";
import {createCart,getAllCarts,getCartById,getCartByUserId,updateCart,  deleteCart,} from "../controllers/cart.controller.ts";
import {createCartSchema,updateCartSchema,cartIdSchema,} from "../validation/cart.validate.ts";
import {validate,validateParams,} from "../middleware/product.middleware.ts";

const router = Router();

// CREATE CART
router.post("/",validate(createCartSchema),createCart);

// GET ALL CARTS
router.get("/",getAllCarts);

// GET CART BY USER ID
router.get("/user/:userId",getCartByUserId);

// GET CART BY ID
router.get("/:id",validateParams(cartIdSchema),getCartById);

// UPDATE CART
router.patch("/:id",validateParams(cartIdSchema),validate(updateCartSchema),updateCart);

// DELETE CART
router.delete("/:id",validateParams(cartIdSchema),deleteCart);

export default router;