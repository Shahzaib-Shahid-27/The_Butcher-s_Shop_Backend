import { z } from "zod";

export const createCartSchema = z.object({
  userId: z
    .string()
    .uuid("Invalid user ID"),
});

export const updateCartSchema = z.object({
  userId: z
    .string()
    .uuid("Invalid user ID")
    .optional(),
});

export const cartIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid cart ID"),
});