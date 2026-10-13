import * as productRepository  from "../repositories/product.repo.ts"
import type { CreateProductType, UpdateProducttype } from "../types/product.types";
import Apperror from "../utils/AppError.ts"

export const  createProduct = async ( data: CreateProductType ) => {

    const createproduct = await productRepository.createProduct(data);

    return createproduct;
};

export const getAllProducts = async (  ) => {

    const createproduct = await productRepository.getAllProducts();

    return createproduct;
};

export const getProductById = async ( id:string ) => {

    const product  = await productRepository.getProductById(id);

    if(!product){
        throw new Apperror("Product not found",404);
    }

    return product ;
};

export const updateProduct = async (id: string, data: UpdateProducttype) => {
  const existingProduct = await productRepository.getProductById(id);

  if (!existingProduct) {
    throw new Apperror("Product not found", 404);
  }

  // Sanitize data object: remove undefined entries and clean empty strings
  const sanitizedData: Partial<UpdateProducttype> = Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        // Convert empty string optional fields (e.g. categoryId, image) to null or omit
        if (typeof value === "string" && value.trim() === "") {
          return [key, null];
        }
        return [key, value];
      })
  );

  const updatedProduct = await productRepository.updateProduct(id, sanitizedData);

  return updatedProduct;
};

export const Delproject = async (id: string) => {
  const existingProduct = await productRepository.getProductById(id);

  if (!existingProduct) {
    throw new Apperror("Product not found", 404);
  }

  await productRepository.deleteProduct(id);

  return existingProduct;
};