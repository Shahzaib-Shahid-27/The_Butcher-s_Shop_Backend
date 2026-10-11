
import { z } from "zod";


// CATEGORY ID
export const categoryIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid category ID"),
});


// CREATE CATEGORY
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(), 
});

// UPDATE CATEGORY
export const updateCategorySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(500).optional(),
  image: z.string().optional(), // Accepts URLs, local paths, or Base64 strings
  isActive: z.boolean().optional(),
});