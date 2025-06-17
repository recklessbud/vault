import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

interface Payload {
  id: string;
  username: string | null;
}

interface PayloadReset extends Payload {
  email: string | null
}
// console.log(process.env.ACCESS_TOKEN_SECRET);

// Generate Access Token
export const generateAccessToken = (user: Payload) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    { id: user.id, username: user.username, },
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" } as jwt.SignOptions
  );
};

// Generate Refresh Token
export const generateRefreshToken = (user: Payload) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" } as jwt.SignOptions
  );
};

export const generateResetToken = (user: PayloadReset) => {
  if(!process.env.RESET_TOKEN_SECRET) {
    throw new Error("RESET_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email},
    process.env.RESET_TOKEN_SECRET as jwt.Secret,
    { expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || "15m" } as jwt.SignOptions
  )
}

// Verify Access Token
export const verifyAccessToken = (token: string) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is missing.");
  }
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is missing.");
  }
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
};

export const verifyResetToken = (token: string) => {
  if(!process.env.RESET_TOKEN_SECRET) {
    throw new Error("RESET_TOKEN_SECRET is missing.");
  }
  return jwt.verify(token, process.env.RESET_TOKEN_SECRET as string);
}