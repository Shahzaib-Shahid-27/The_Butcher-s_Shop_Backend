import { type Request,type Response, type NextFunction } from "express";

import * as productService from "../services/product.service.ts"


export const createProduct = async ( req:Request, res:Response, next:NextFunction ) => {
    
    try {
        const product = await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
        
    } catch (error) {
        next(error);
    }

}


export const getAllProducts  = async ( req:Request, res:Response, next:NextFunction ) => {
    
    try {
        const product = await productService.getAllProducts();

        res.status(200).json({
            success: true,
            message: "Product Fetch Successfully",
            data: product,
        });

    } catch (error) {
        next(error);
    }

};




export const getProductById = async ( req:Request, res:Response, next:NextFunction ) => {
    
    try {
        const product = await productService.getProductById(String(req.params.id));
        
        res.status(200).json({
            success: true,
            message: "Product Fetch by id Successfully",
            data: product,
        });
        
    } catch (error) {
        next(error);
    }
    
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Filter out undefined values to support partial PATCH updates
    const cleanedBody = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );

    // Ensure numeric types are properly converted if passed as strings
    if (cleanedBody.price !== undefined) {
      cleanedBody.price = Number(cleanedBody.price);
    }
    if (cleanedBody.stock !== undefined) {
      cleanedBody.stock = Number(cleanedBody.stock);
    }

    const product = await productService.updateProduct(String(id), cleanedBody);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.Delproject(String(req.params.id));

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

