import type {Request,Response,} from "express";

import * as cartService from "../services/cart.service.ts";


// CREATE CART
export const createCart = async (  req: Request,  res: Response) => {
  const cart = await cartService.createCart(req.body);

  res.status(201).json({
    success: true,
    message: "Cart created successfully",
    data: cart,
  });
};


// GET ALL CARTS
export const getAllCarts = async (req: Request,res: Response) => {
  const carts = await cartService.getAllCarts();

  res.status(200).json({
    success: true,
    message: "Carts fetched successfully",
    data: carts,
  });
};


// GET CART BY ID
export const getCartById = async (req: Request,res: Response) => {
  const cart = await cartService.getCartById(String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
};


// GET CART BY USER ID
export const getCartByUserId = async (req: Request,res: Response) => {
  const cart = await cartService.getCartByUserId(String(req.params.userId));

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
};



// UPDATE CART
export const updateCart = async (req: Request,res: Response) => {
  const cart = await cartService.updateCart(String(req.params.id),req.body);

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
};



// DELETE CART
export const deleteCart = async (req: Request,res: Response) => {
  const cart =await cartService.deleteCart(String(req.params.id));

  res.status(200).json({
    success: true,
    message: "Cart deleted successfully",
    data: cart,
  });
};