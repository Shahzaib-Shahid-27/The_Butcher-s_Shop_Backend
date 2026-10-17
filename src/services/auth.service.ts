
import * as authRepository from '../repositories/auth.repo.js'
import AppError from "../utils/AppError.js"
import bcrypt from "bcryptjs";

import { OAuth2Client } from "google-auth-library";

import {generateAccessToken,generateRefreshToken,} from "../utils/TokenGen.js";

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string,hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


const getRefreshTokenExpiry = (): string => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();


const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


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

    return {
    user: {
      id: checkuser.id,
      name: checkuser.name,
      email: checkuser.email,
      role: checkuser.role,
    },
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

export const getProfile = async (userId: string) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

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



// GOOGLE REDIRECT URL
export const getGoogleAuthUrl = (): string => {

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AppError(
      "GOOGLE_CLIENT_ID is missing.",
      500
    );
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new AppError(
      "GOOGLE_CLIENT_SECRET is missing.",
      500
    );
  }

  if (!process.env.GOOGLE_REDIRECT_URI) {
    throw new AppError(
      "GOOGLE_REDIRECT_URI is missing.",
      500
    );
  }

  return googleClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
    ],
    prompt: "select_account",
  });
};

// ==============================
// GOOGLE CALLBACK

export const googleCallback = async (code: string) => {
  if (!code) {
    throw new AppError(
      "Google authorization code is missing.",
      400
    );
  }

  try {
    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      throw new AppError(
        "Google ID token was not returned.",
        401
      );
    }

    return await googleLogin(tokens.id_token);
  } catch (error) {
    console.error(
      "GOOGLE CALLBACK ERROR:",
      error
    );

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(
        `Google authentication failed: ${error.message}`,
        401
      );
    }

    throw new AppError(
      "Google authentication failed.",
      401
    );
  }
};

// ==============================
// GOOGLE LOGIN

export const googleLogin = async (idToken: string) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AppError("GOOGLE_CLIENT_ID is missing.", 500);
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError("Invalid Google token.", 401);
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    if (!googleId || !email) {
      throw new AppError("Google account information is incomplete.", 401);
    }

    if (payload.email_verified !== true) {
      throw new AppError("Google email is not verified.", 401);
    }

    // 1. Find user by Google ID
    let user = await authRepository.findUserByGoogleId(googleId);

    // 2. If not found, find by email and link the Google account
    if (!user) {
      user = await authRepository.findUserByEmail(email);

      if (user && !user.googleId) {
        await authRepository.linkGoogleAccount(
          user.id,
          googleId,
          payload.picture ?? null
        );
      }
    }

    // 3. If still not found, create a new user
    if (!user) {
      const randomPassword = `${googleId}:${email}:${Date.now()}`;
      const hashedPassword = await hashPassword(randomPassword);

      user = await authRepository.createuser(
        name || "Google User",
        email,
        hashedPassword,
        googleId
      );
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await authRepository.storeRefreshToken(
      user.id,
      refreshToken,
      getRefreshTokenExpiry()
    );

    const { password: _password, ...safeUser } = user;

    return {
      tokens: { accessToken, refreshToken },
      user: safeUser,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(`Google authentication failed: ${error.message}`, 401);
    }

    throw new AppError("Google authentication failed.", 401);
  }
};