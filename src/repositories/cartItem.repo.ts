import { db } from "../prisma/db.ts";

import type {
  CreateCartItemType,
  UpdateCartItemType,
} from "../types/cartItem.types";

// CREATE CART ITEM
export const createCartItem = async (
  data: CreateCartItemType
) => {
  return db.orm.public.CartItem.create({
    cartId: data.cartId,
    productId: data.productId,
    quantity: data.quantity,
  });
};

// GET ALL CART ITEMS
export const getAllCartItems = async () => {
  return db.orm.public.CartItem.all();
};

// GET CART ITEM BY ID
export const getCartItemById = async (
  id: string
) => {
  return db.orm.public.CartItem
    .where({ id })
    .first();
};

// GET ITEMS BY CART ID
export const getCartItemsByCartId = async (
  cartId: string
) => {
  return db.orm.public.CartItem
    .where({ cartId })
    .all();
};

// GET ITEM BY CART + PRODUCT
export const getCartItemByProduct = async (
  cartId: string,
  productId: string
) => {
  return db.orm.public.CartItem
    .where({
      cartId,
      productId,
    })
    .first();
};

// UPDATE QUANTITY
export const updateCartItem = async (
  id: string,
  data: UpdateCartItemType
) => {
  return db.orm.public.CartItem
    .where({ id })
    .update({
      quantity: data.quantity,
    });
};

// DELETE CART ITEM
export const deleteCartItem = async (
  id: string
) => {
  return db.orm.public.CartItem
    .where({ id })
    .delete();
};