
import * as categoryRepository from "../repositories/category.repos.ts";
import type {CreateCategoryType,UpdateCategoryType,} from "../types/category.types";

import AppError from "../utils/AppError.ts";


// CREATE CATEGORY
export const createCategory = async (data: CreateCategoryType) => {
  const category = await categoryRepository.createCategory(data);

  return category;
};


// GET ALL CATEGORIES
export const getAllCategories = async () => {
  const categories = await categoryRepository.getAllCategories();

  return categories;
};


// GET CATEGORY BY ID
export const getCategoryById = async (id: string) => {
  const category = await categoryRepository.getAllCategoriesId(id);

  if (!category) {
    throw new AppError("Category not found!",404);
  }

  return category;
};


// UPDATE CATEGORY
export const updateCategory = async ( id: string,  data: UpdateCategoryType) => {
  const category = await categoryRepository.getAllCategoriesId(id);

  if (!category) { 
    throw new AppError("Category not found!",404);
  }

  const updatedCategory = await categoryRepository.updateCategory(id,data);

  return updatedCategory;
};


// DELETE CATEGORY
export const deleteCategory = async ( id: string) => {
  const category = await categoryRepository.getAllCategoriesId(id);

  if (!category) {
    throw new AppError("Category not found!",404);
  }

  const deletedCategory = await categoryRepository.deleteCategory(id);

  return deletedCategory;
};
