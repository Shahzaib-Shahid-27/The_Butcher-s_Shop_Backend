import type {
  Request,
  Response,
} from "express";

import * as cartItemService from "../services/cartItem.service.ts";

// ADD PRODUCT TO CART
export const createCartItem = async (
  req: Request,
  res: Response
) => {
  const cartItem =
    await cartItemService.createCartItem(
      req.body
    );

  res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    data: cartItem,
  });
};

// GET ALL CART ITEMS
export const getAllCartItems = async (
  req: Request,
  res: Response
) => {
  const cartItems =
    await cartItemService.getAllCartItems();

  res.status(200).json({
    success: true,
    message: "Cart items fetched successfully",
    data: cartItems,
  });
};

// GET CART ITEM BY ID
export const getCartItemById = async (
  req: Request,
  res: Response
) => {
  const cartItem =
    await cartItemService.getCartItemById(
      String(req.params.id)
    );

  res.status(200).json({
    success: true,
    message: "Cart item fetched successfully",
    data: cartItem,
  });
};

// GET ITEMS BY CART
export const getCartItemsByCartId = async (
  req: Request,
  res: Response
) => {
  const cartItems =
    await cartItemService.getCartItemsByCartId(
      String(req.params.cartId)
    );

  res.status(200).json({
    success: true,
    message: "Cart items fetched successfully",
    data: cartItems,
  });
};

// UPDATE CART ITEM
export const updateCartItem = async (
  req: Request,
  res: Response
) => {
  const cartItem =
    await cartItemService.updateCartItem(
      String(req.params.id),
      req.body
    );

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: cartItem,
  });
};

// DELETE CART ITEM
export const deleteCartItem = async (
  req: Request,
  res: Response
) => {
  const cartItem =
    await cartItemService.deleteCartItem(
      String(req.params.id)
    );

  res.status(200).json({
    success: true,
    message: "Cart item deleted successfully",
    data: cartItem,
  });
};