/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken, verifyAccessToken } from "../utils/token.utils";
import { errorResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { logger } from "../utils/logger";
import { User } from "@prisma/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = 
  req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Authentication failed: No token provided", {
      path: req.path,
      ip: req.ip,
    });
    errorResponse(res, 401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = verifyRefreshToken(token) as {
      id: string;
      username: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (!user) {
      logger.warn("Authentication failed: User not found", {
        userId: decodedToken.id,
        path: req.path,
      });
      errorResponse(res, 401).json({ message: "Not Found" });
      return;
    }

    req.user = user;

    logger.info("User authenticated successfully", {
      userId: user.id,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error("Authentication error", {
      error: error instanceof Error ? error.message : "Unknown error",
      path: req.path,
      ip: req.ip,
    });
    if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(res, 401).json({ message: "Invalid or expired token" });
      return;
    }

    next(error);
  }
};


export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyRefreshToken(token) as { id: string; username: string };


    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      logger.warn("Authentication failed: User not found", {
        userId: decoded.id,
        path: req.path,
      });
      return errorResponse(res, 401).json({ message: "User not found" });
    }

    req.user = user;

    logger.info("User authenticated successfully", {
      userId: user.id,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error("Authentication error", {
      error: error instanceof Error ? error.message : "Unknown error",
      path: req.path,
      ip: req.ip,
    });

    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 401).json({ message: "Token expired" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 401).json({ message: "Invalid token" });
    }

    return next(error); // Let Express handle unexpected errors
  }
};