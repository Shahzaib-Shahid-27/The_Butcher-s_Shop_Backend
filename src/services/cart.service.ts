import * as cartRepository from "../repositories/cart.repository.ts";
import type {CreateCartType,UpdateCartType,} from "../types/cart.types";

import Apperror from "../utils/AppError.ts";

// CREATE CART
export const createCart = async (data: CreateCartType) => {
  // Check if user already has a cart
  const existingCart = await cartRepository.getCartByUserId(data.userId);

  if (existingCart) {
    throw new Apperror(
      "User already has a cart",
      409
    );
  }

  const cart =
    await cartRepository.createCart(data);

  return cart;
};

// GET ALL CARTS
export const getAllCarts = async () => {
  const carts = await cartRepository.getAllCarts();

  return carts;
};

// GET CART BY ID
export const getCartById = async (id: string) => {
  const cart = await cartRepository.getCartById(id);

  if (!cart) {
    throw new Apperror(
      "Cart not found",
      404
    );
  }

  return cart;
};

// GET CART BY USER ID
export const getCartByUserId = async (userId: string) => {
  const cart = await cartRepository.getCartByUserId(userId);

  if (!cart) {
    throw new Apperror(
      "Cart not found",
      404
    );
  }

  return cart;
};

// UPDATE CART
export const updateCart = async (id: string,data: UpdateCartType) => {
  const existingCart =
    await cartRepository.getCartById(id);

  if (!existingCart) {
    throw new Apperror(
      "Cart not found",
      404
    );
  }

  const updatedCart =
    await cartRepository.updateCart(id, data);

  return updatedCart;
};

// DELETE CART
export const deleteCart = async (id: string) => {
  const existingCart = await cartRepository.getCartById(id);

  if (!existingCart) {
    throw new Apperror(
      "Cart not found",
      404
    );
  }

  await cartRepository.deleteCart(id);

  return existingCart;
};