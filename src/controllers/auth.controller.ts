  import type { Request, Response } from "express";

  import * as authService from "../services/auth.service.js";
  import AppError from "../utils/AppError.js";


  export const register = async ( req:Request,res:Response) => {

    const { email,name,password} = req.body;

    if (!name || !email || !password) {
        throw new AppError(
          "Name, email and password are required.",
          400
        );
      }

    const result = await authService.registeruser(name,email,password)

    res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
    });
  }


  export const login = async ( req:Request,res:Response ) => {
    
    const { email,password } = req.body;

    if ( !email || !password) {
        throw new AppError(
          " email and password are required.",
          400
        );
      }

    const result =  await authService.loginuser(email,password)

   res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
  }

  export const logout = async ( req:Request,res:Response ) => {
    
    const userId = req.user?.userId;

     if ( !userId) {
        throw new AppError(
          "Unauthorized",
          400
        );
    }
    await authService.logout(userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });

  }

  export const forgotPassword = async ( req:Request,res:Response ) => {
        
    const { email } = req.body;

    if(!email){
        throw new AppError("Email is required.",400)
    }

    await authService.forgetpassword(email)

    res.status(200).json({
      success: true,
       message:"If an account with this email exists, password reset instructions will be sent."
    });

  }


export const resetPassword = async (  req: Request,  res: Response) => {
  
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new AppError("Email and new password are required.",400);
  }

  await authService.resetPassword(email, newPassword);

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
};


  export const getProfile = async ( req:Request,res:Response ) => {
    
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("Unauthorized.",401);
    }

    const user = await authService.getProfile( userId );

   return res.status(200).json({
      success: true,
      data: {
        user: {
          id: userId,
          name: user.user.name,
          email: user.user.email,
        },
      },
    });
  }

  export const refreshToken = async ( req:Request,res:Response ) => {
     
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new AppError("Refresh token is required.",400);
    }

    const token = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully.",
        data: token,
      });
  }