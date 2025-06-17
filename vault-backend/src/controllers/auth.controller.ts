/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
// import * as Auth_model from "../models/auth.models";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import bcrypt from "bcryptjs";
import { Login, Register } from "../utils/validation.utils";
// import { roleMiddleware } from "../middlewares/auth.middleware";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
} from "../utils/token.utils";
// import { access } from "fs";
import { logger } from "../utils/logger";
import { log } from "console";
import { sendEEmail } from "../services/email.service";
import { token } from "morgan";

export const getLoginPage = (req: Request, res: Response) => {
  res.render("auth/login", { title: "Login", message: "" });
};

export const getRegisterPage = (req: Request, res: Response) => {
  res.render("auth/register", { title: "Register", message: "" });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as Login;
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });
  if (!user) {
    logger.warn("Failed Login Attempt", {
      username: body.username,
      ip: req.ip,
      reason: "User not found",
    });
    errorResponse(res, 401).json({ message: "Invalid Credentials" });
    // render('auth/login', {title: 'Login', message: 'Invalid credentials.'});
    return;
  }
  const isMatch = await bcrypt.compare(body.password, user.password);
  if (!isMatch) {
    logger.warn("Failed login attempt", {
      username: body.username,
      ip: req.ip,
      reason: "Password does not match",
    });
    errorResponse(res, 401).json({ message: "Invalid Credentials" });
    //render('auth/login', {title: 'Login', message: 'Invalid credentials.'});
    return;
  }


  const accessToken = generateAccessToken({
    id: user.id,
    username: body.username,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    username: body.username,
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "unknown",
    },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  console.log(accessToken);
  successResponse(res, 200).json({ refreshToken, user });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    logger.warn("Refresh token not found");
    errorResponse(res, 401).render("errors/500", {
      title: "Login",
      message: "unauthorized",
    });
  }
  const decoded = verifyRefreshToken(refreshToken) as {
    id: string;
    username: string;
  };
  const session = await prisma.session.findUnique({
    where: { token: refreshToken },
  });
  if (!session) {
    logger.warn("Invalid refresh token", {
      ip: req.ip,
      reason: "Session not found",
    });
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }

  const accessToken = generateAccessToken({
    id: decoded.id,
    username: decoded.username,
  });
  const newRefreshToken = generateRefreshToken({
    id: decoded.id,
    username: decoded.username,
  });

  await prisma.session.update({
    where: { token: refreshToken },
    data: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Set new refresh token in the cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  console.log(accessToken);

  logger.info("Refresh token refreshed", { userId: decoded.id });
  successResponse(res, 200).json({ accessToken });
};

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as Register;
  const existingUser = await prisma.user.findUnique({
    where: {
      username: body.username,
      email: body.email,
    },
  });
  if (existingUser) {
    logger.warn("Failed Signup Attempt", {
      username: body.username,
      ip: req.ip,
      reason: "User already exists",
    });
    errorResponse(res, 409).render("auth/register", {
      title: "Register",
      message: "User already exists. Please login.",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: hashedPassword,
    },
  });
  const accessToken = generateAccessToken({
    id: user.id,
    username: body.username,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    username: body.username,
  });
  await prisma.session.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "unknown",
    },
  });
   res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });


  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // req.session.id = user.id
  logger.info("User registered", {
    username: body.username,
    ip: req.ip,
  });
  successResponse(res, 201).json({refreshToken, user });
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorResponse(res, 401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Invalidate token by deleting it (or marking it as revoked)
    await prisma.session.delete({
      where: { token },
    });
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    errorResponse(res,500).json({ message: "Failed to logout" });
  }
};
export const getForgot = (req: Request, res: Response) => {
  res.render("auth/forgot", { message: "" });
};

export const getReset = (req: Request, res: Response)=>{
    res.render("auth/resetPass", {token: req.params.token})
}

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;
  try {
    if (!email) {
      errorResponse(res, 400).json({ message: "Email is required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn("Failed password reset attempt", {
        ip: req.ip,
        email: email,
        reason: "User not found",
      });
      errorResponse(res, 404).json({ message: "User not found" });
      return;
    }
    const token = generateResetToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Update the user with the reset token and expiry
    await prisma.user.update({
      where: { email: email },
      data: {
        resetToken: token,
        resetTokenExpires: resetTokenExpires,
      },
    });

    const resetLink = `http://localhost:4001/auth/reset-password/${token}`;
    const emailText = `
    Hello ${user.username},

      Click the link below to reset your password:
        ${resetLink}

        This link will expire in 10 minutes.

    If you didn’t request this, please ignore it.`;

    await sendEEmail(user.email, "Password reset", emailText);
    logger.info("Password reset email sent", { email: user.email });
    successResponse(res, 200).json({ message: "Password reset email sent" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    logger.error("Password reset error", {
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, 500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        resetToken: token,
      },
    });
    if (!user) {
      logger.warn("Failed password reset attempt", {
        ip: req.ip,
        token: token,
        reason: "User not found",
      });
      errorResponse(res, 404).json({ message: "User not found" });
      return;
    }
    if (user.resetTokenExpires! < new Date()) {
      logger.warn("Failed password reset attempt", {
        ip: req.ip,
        token: token,
        reason: "Token expired",
      });
      errorResponse(res, 400).json({ message: "Token expired" });
      return;
    }
    if (newPassword !== confirmPassword) {
      logger.warn("Failed password reset attempt", {
        ip: req.ip,
        token: token,
        reason: "Passwords do not match",
      });
      errorResponse(res, 400).json({ message: "Passwords do not match" });
      return;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedNewPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    logger.info("Password reset successfully", {
      username: user.username,
      ip: req.ip,
    });
    successResponse(res, 200).json({ message: "Password reset successfully" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    logger.error("error reset password", {
      error: error.message,
      stack: error.stack,
    });
  }
};
