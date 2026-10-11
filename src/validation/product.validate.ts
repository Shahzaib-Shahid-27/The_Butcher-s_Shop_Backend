import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  image: z
    .string()
    .optional(),

  isActive: z
    .boolean()
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .optional(),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .optional(),

  price: z
    .number()
    .positive("Price must be greater than 0")
    .optional(),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),

  image: z
    .string()
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const productIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid product ID"),
});