import { db } from "../prisma/db.ts";

import type {CreateCartType,UpdateCartType,} from "../types/cart.types";


// CREATE CART
export const createCart = async (data: CreateCartType) => {
  return db.orm.public.Cart.create({
    userId: data.userId,
  });
};


// GET ALL CARTS
export const getAllCarts = async () => {
  return db.orm.public.Cart.all();
};


// GET CART BY ID
export const getCartById = async (id: string) => {
  return db.orm.public.Cart
    .where({ id })
    .first();
};


// GET CART BY USER ID
export const getCartByUserId = async ( userId: string) => {
  return db.orm.public.Cart
    .where({ userId })
    .first();
};


// UPDATE CART
export const updateCart = async (  id: string,  data: UpdateCartType) => {
  return db.orm.public.Cart
    .where({ id })
    .update(data);
};


// DELETE CART
export const deleteCart = async ( id: string) => {
  return db.orm.public.Cart
    .where({ id })
    .delete();
};
