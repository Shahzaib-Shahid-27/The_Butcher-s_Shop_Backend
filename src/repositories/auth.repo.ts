import { db } from "../prisma/db.ts";

export const createuser = async (name: string,email: string,password: string) => {
  return await db.orm.public.User.create({
    name,
    email,
    password,
    expiresAt: new Date().toISOString(),
  });
};


export const findUserByEmail = async (email: string) => {
  const users = await db.orm.public.User
    .where({ email })
    .all();

  return users[0] ?? null;
};


export const findUserById = async (userid: string) => {
  return await db.orm.public.User
    .where({ id: userid })
    .first();
};

export const updatePassword = async (id: string,password: string) => {
  return await db.orm.public.User
    .where({ id })
    .update({ password });
};

export const storeRefreshToken = async (userid: string,refreshToken: string,expiresAt: string) => {
  return await db.orm.public.User
    .where({ id: userid })
    .update({ refreshToken,expiresAt });
};

export const deleteRefreshToken = async (userId: string) => {
  return await db.orm.public.User
    .where({ id: userId })
    .update({ refreshToken: "",expiresAt: "" });
};

export const findUserByRefreshToken = async (refreshToken: string) => {
  return await db.orm.public.User
    .where({ refreshToken })
    .first();
};