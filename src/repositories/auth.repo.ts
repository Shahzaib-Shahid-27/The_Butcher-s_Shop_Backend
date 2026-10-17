import { db } from "../prisma/db.ts";

export const createuser = async (name: string,email: string,password: string,googleId?: string) => {
  return await db.orm.public.User.create({
    name,
    email,
    password,
     ...(googleId ? { googleId } : {}),
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
  const user = await db.orm.public.User
    .where({ id: userid })
    .first();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
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

export const createGoogleUser = async ( name: string,email: string,googleId: string,avatar: string | null ) => {
    return await db.orm.public.User.create({
  name, email, googleId, avatar, expiresAt: new Date().toISOString()
    })
};

export const linkGoogleAccount = async (id: string, googleId: string, avatar: string | null) => {
  return await db.orm.public.User
    .where({ id })
    .update({ googleId, ...(avatar ? { avatar } : {}) });
};

export const findUserByGoogleId = async ( googleId: string) => {
  return await db.orm.public.User
  .where({ googleId })
  .first();
};
