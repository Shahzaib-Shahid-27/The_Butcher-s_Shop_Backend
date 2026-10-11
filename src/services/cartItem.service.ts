import * as cartItemRepository from "../repositories/cartItem.repo.ts";

import type {
  CreateCartItemType,
  UpdateCartItemType,
} from "../types/cartItem.types";

import Apperror from "../utils/AppError.ts";

// ADD PRODUCT TO CART
export const createCartItem = async (
  data: CreateCartItemType
) => {
  // Check if product already exists in cart
  const existingItem =
    await cartItemRepository.getCartItemByProduct(
      data.cartId,
      data.productId
    );

  if (existingItem) {
    throw new Apperror(
      "Product is already in the cart",
      409
    );
  }

  const cartItem =
    await cartItemRepository.createCartItem(data);

  return cartItem;
};

// GET ALL CART ITEMS
export const getAllCartItems = async () => {
  return cartItemRepository.getAllCartItems();
};

// GET CART ITEM BY ID
export const getCartItemById = async (
  id: string
) => {
  const cartItem =
    await cartItemRepository.getCartItemById(id);

  if (!cartItem) {
    throw new Apperror(
      "Cart item not found",
      404
    );
  }

  return cartItem;
};

// GET ITEMS BY CART
export const getCartItemsByCartId = async (
  cartId: string
) => {
  return cartItemRepository.getCartItemsByCartId(
    cartId
  );
};

// UPDATE CART ITEM
export const updateCartItem = async (
  id: string,
  data: UpdateCartItemType
) => {
  const existingItem =
    await cartItemRepository.getCartItemById(id);

  if (!existingItem) {
    throw new Apperror(
      "Cart item not found",
      404
    );
  }

  const updatedItem =
    await cartItemRepository.updateCartItem(
      id,
      data
    );

  return updatedItem;
};

// DELETE CART ITEM
export const deleteCartItem = async (
  id: string
) => {
  const existingItem =
    await cartItemRepository.getCartItemById(id);

  if (!existingItem) {
    throw new Apperror(
      "Cart item not found",
      404
    );
  }

  await cartItemRepository.deleteCartItem(id);

  return existingItem;
};