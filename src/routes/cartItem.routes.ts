import { Router } from "express";
import {createCartItem,getAllCartItems,getCartItemById,getCartItemsByCartId,updateCartItem,deleteCartItem,} from "../controllers/cartItem.controller.ts";
import {createCartItemSchema,updateCartItemSchema,cartItemIdSchema,} from "../validation/cartItem.validate.ts";
import {validate,validateParams,} from "../middleware/product.middleware.ts";

const router = Router();

// ADD PRODUCT TO CART
router.post("/",validate(createCartItemSchema),createCartItem);

// GET ALL CART ITEMS
router.get("/",getAllCartItems);

// GET ITEMS BY CART ID
router.get("/cart/:cartId",getCartItemsByCartId);

// GET CART ITEM BY ID
router.get("/:id",validateParams(cartItemIdSchema),getCartItemById);

// UPDATE QUANTITY
router.patch("/:id",validateParams(cartItemIdSchema),validate(updateCartItemSchema),updateCartItem);

// DELETE ITEM
router.delete("/:id",validateParams(cartItemIdSchema),deleteCartItem);

export default router;