
import * as authRepository from '../repositories/auth.repo.js'
import AppError from "../utils/AppError.js"
import bcrypt from "bcryptjs";

import {generateAccessToken,generateRefreshToken,} from "../utils/TokenGen.js";

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string,hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


const getRefreshTokenExpiry = (): string => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

export const registeruser = async (  name: string,email: string,  password: string) => {
  const existsuser = await authRepository.findUserByEmail(email);

  if (existsuser) {
    throw new AppError(
      "User with this email already exists.",
      409
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await authRepository.createuser(
    name,
    email,
    hashedPassword
  );

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await authRepository.storeRefreshToken(
    user.id,
    refreshToken,
    getRefreshTokenExpiry()
  );

   const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

  return {
    user: safeUser,
  };
};



export const loginuser = async (email: string,password: string) => {
  const checkuser = await authRepository.findUserByEmail(email);

  if (!checkuser) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  if (!checkuser.password) {
    throw new AppError(
      "This account does not have a password. Please login again.",
      401
    );
  }

  const matchpassword = await comparePassword(
    password,
    checkuser.password
  );

  if (!matchpassword) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  // Generate tokens
  const accessToken = generateAccessToken(checkuser.id);
  const refreshToken = generateRefreshToken(checkuser.id);

  // Store refresh token in database
  await authRepository.storeRefreshToken(
    checkuser.id,
    refreshToken,
    getRefreshTokenExpiry()
  );

  const safeUser = {
    id: checkuser.id,
    name: checkuser.name,
    email: checkuser.email,
  };

  return {
    user: safeUser,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};



export const logout = async ( userid:string ) => {
    const user = (await authRepository.findUserById(userid)) as { refreshToken?: string } | null;

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (user.refreshToken) {
        await authRepository.storeRefreshToken(userid, "", new Date(0).toISOString());
    }

    return true;
}

// FORGOT PASSWORD
export const forgetpassword = async (email: string) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return true;
};

// RESET PASSWORD
export const resetPassword = async ( email: string,newPassword: string) => {
  
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const hashedPassword = await hashPassword(newPassword);

  await authRepository.updatePassword(user.id,hashedPassword);

  return true;
};

export const getProfile = async( userId: string ) => {
    
    const user = await authRepository.findUserById(userId);

    if(!user){
        throw new AppError("User not found.", 404);
    }

    const safeUser = {
        name: user.name,
        email: user.email,
    };

  return {
    user: safeUser,
  };
    
}

export const refreshAccessToken = async ( refreshToken: string ) => {

    const storedToken = await authRepository.findUserByRefreshToken(refreshToken);

    if (!storedToken) {
        throw new AppError("Invalid refresh token.", 401);
    }

    if (
        storedToken.expiresAt &&
        new Date(storedToken.expiresAt) < new Date()
    ) {
        throw new AppError("Refresh token expired.", 401);
    }

    const accessToken = generateAccessToken(storedToken.id);
    const newRefreshToken = generateRefreshToken(storedToken.id);

    await authRepository.storeRefreshToken(
        storedToken.id,
        newRefreshToken,
        getRefreshTokenExpiry()
    );

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };

}