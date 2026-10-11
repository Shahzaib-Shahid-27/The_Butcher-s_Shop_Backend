import { db } from "../prisma/db.ts";

import type { CreateCategoryType, UpdateCategoryType } from  "../types/category.types.ts"

// createCategory
export const createCategory = async ( data:CreateCategoryType ) => {
    return db.orm.public.Category.create({
        name:data.name,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
    });
};

// GET ALL CATEGORIES
export const getAllCategories = async (  )  => {
    return db.orm.public.Category.all();
};


// GET CATEGORY BY ID
export const getAllCategoriesId = async ( id:string ) => {
    return db.orm.public.Category.where({ id }).first();
};


// GET updateCategory 
export const updateCategory  = async ( id:string ,data:UpdateCategoryType ) => {
    return db.orm.public.Category.where({ id }).update(data)
};


// GET deleteCategory
export const deleteCategory  = async ( id:string ) => {
    return db.orm.public.Category.where({ id }).delete();
};


