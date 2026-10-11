import type { Request, Response } from "express";

import * as categoryService from "../services/category.service.ts";


// CREATE CATEGORY
export const createCategory = async ( req: Request,res: Response) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};


// GET ALL CATEGORIES
export const getAllCategories = async (  req: Request,res: Response) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
};


// GET CATEGORY BY ID
export const getCategoryById = async (  req: Request,  res: Response) => {
  const category = await categoryService.getCategoryById( req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
};


// UPDATE CATEGORY
export const updateCategory = async (  req: Request,res: Response) => {
  const category = await categoryService.updateCategory( req.params.id as string, req.body);

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};

// DELETE CATEGORY
export const deleteCategory = async (req: Request,res: Response) => {
  const category = await categoryService.deleteCategory( req.params.id as string );

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
};