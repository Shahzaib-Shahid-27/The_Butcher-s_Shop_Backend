import { db } from "../prisma/db.ts";

import type {
  CreateProductType,
  UpdateProducttype,
} from "../types/product.types";

// CREATE PRODUCT
export const createProduct = async (data: CreateProductType) => {
  const category = await db.orm.public.Category
    .where({ name: "General" })
    .first();

  if (!data.categoryId && !category) {
    throw new Error(
      'Default category "General" was not found. Create it first.'
    );
  }

  return db.orm.public.Product.create({
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    stock: data.stock,
    image: data.image,
    isActive: data.isActive ?? true,
    categoryId: data.categoryId ?? category!.id,
  });
};

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  return db.orm.public.Product.all();
};


// GET PRODUCT BY ID
export const getProductById = async (id: string) => {
  return db.orm.public.Product
    .where({ id })
    .first();
};


// UPDATE PRODUCT
export const updateProduct = async (id: string,data: UpdateProducttype) => {
  return db.orm.public.Product
    .where({ id })
    .update({
      ...data,
      price: data.price?.toString(),
    });
};


// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  return db.orm.public.Product
    .where({ id })
    .delete();
};