import { z } from "zod";

// CREATE CART ITEM
export const createCartItemSchema = z.object({
  cartId: z
    .string()
    .uuid("Invalid cart ID"),

  productId: z
    .string()
    .uuid("Invalid product ID"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

// UPDATE CART ITEM
export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

// CART ITEM ID
export const cartItemIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid cart item ID"),
});