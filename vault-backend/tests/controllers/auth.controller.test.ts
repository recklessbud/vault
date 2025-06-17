/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; 
import {
  loginUser,
  RegisterUser,
  refresh,
  logout,
} from "../../src/controllers/auth.controller";
import { errorResponse, successResponse } from "../../src/utils/responses.utils";
import prisma from "../../src/config/dbconn";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../src/utils/token.utils";
import { logger } from "../../src/utils/logger";
import request from "supertest";
import app from '../../src/app'



jest.mock("../../src/utils/responses.utils");
jest.mock("../../src/config/dbconn", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("bcryptjs");
jest.mock("../../src/utils/token.utils");
jest.mock("../../src/utils/logger");

describe("Get Pages", () => {
  test("testGetRegisterPage", async () => {
    const res = await request(app).get("/auth/register");
    expect(res.status).toBe(200);
  });
  test("testGetLoginPage", async () => {
    const res = await request(app).get("/auth/login");
    expect(res.status).toBe(200);
  });
})

describe("Auth Controller Tests", () => { 
  let mockRequest: Partial<any>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      cookies: {},
      ip: "127.0.0.1",
      headers: { "user-agent": "test-agent" },
      user: { id: "user123", username: "testuser" },
    };
    mockResponse = {
      render: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    (errorResponse as jest.Mock).mockReturnValue(mockResponse);
    (successResponse as jest.Mock).mockReturnValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("testSuccessfulLogin", async () => {
    // Arrange
    mockRequest.body = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      id: "user123",
      username: "testuser",
      password: "hashedPassword",
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateAccessToken as jest.Mock).mockReturnValue("access-token");
    (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");
    (prisma.session.create as jest.Mock).mockResolvedValue({
      id: "session123",
    });

    // Act
    await loginUser(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
    });
    expect(generateRefreshToken).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
    });
    expect(prisma.session.create).toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);

  });

  test("testSuccessfulRegistration", async () => {
    // Arrange
    mockRequest.body = {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    const mockUser = {
      id: "user456",
      username: "newuser",
      email: "new@example.com",
      password: "hashedPassword",
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (generateAccessToken as jest.Mock).mockReturnValue("access-token");
    (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");
    (prisma.session.create as jest.Mock).mockResolvedValue({
      id: "session456",
    });

    // Act
    await RegisterUser(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "newuser", email: "new@example.com" },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: "newuser",
        email: "new@example.com",
        password: "hashedPassword",
      },
    });
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: "user456",
      username: "newuser",
    });
    expect(generateRefreshToken).toHaveBeenCalledWith({
      id: "user456",
      username: "newuser",
    });
    expect(prisma.session.create).toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledWith(
      "User registered",
      expect.any(Object)
    );
    expect(successResponse).toHaveBeenCalledWith(mockResponse, 201);
  });

  test("testSuccessfulTokenRefresh", async () => {
    // Arrange
    mockRequest.cookies = { refreshToken: "valid-refresh-token" };
   
    const decodedToken = { id: "user123", username: "testuser" };
    (verifyRefreshToken as jest.Mock).mockReturnValue(decodedToken);
    (prisma.session.findUnique as jest.Mock).mockResolvedValue({
      id: "session123",
      token: "valid-refresh-token",
    });
    (generateAccessToken as jest.Mock).mockReturnValue("new-access-token");
    (generateRefreshToken as jest.Mock).mockReturnValue("new-refresh-token");
    (prisma.session.update as jest.Mock).mockResolvedValue({
      id: "session123",
    });

    // Act
    await refresh(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(verifyRefreshToken).toHaveBeenCalledWith("valid-refresh-token");
    expect(prisma.session.findUnique).toHaveBeenCalledWith({
      where: { token: "valid-refresh-token" },
    });
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
    });
    expect(generateRefreshToken).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
    });
    expect(prisma.session.update).toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "new-refresh-token",
      expect.any(Object)
    );
    expect(logger.info).toHaveBeenCalledWith("Refresh token refreshed", {
      userId: "user123",
    });
    expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      accessToken: "new-access-token",
    });
    
  });

  test("testLoginWithNonExistentUser", async () => {
    // Arrange
    mockRequest.body = {
      username: "nonexistent",
      email: "nonexistent@example.com",
      password: "password123",
    }; 

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Act
    await loginUser(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "nonexistent" },
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "Failed Login Attempt",
      expect.any(Object)
    );
    expect(errorResponse).toHaveBeenCalledWith(mockResponse, 401);

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("testRegistrationWithExistingUser", async () => {
    // Arrange
    mockRequest.body = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    const existingUser = {
      id: "user789",
      username: "existinguser",
      email: "existing@example.com",
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    // Act
    await RegisterUser(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "existinguser", email: "existing@example.com" },
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "Failed Signup Attempt",
      expect.any(Object)
    );
    expect(errorResponse).toHaveBeenCalledWith(mockResponse, 409);
    expect(mockResponse.render).toHaveBeenCalledWith("auth/register", {
      title: "Register",
      message: "User already exists. Please login.",
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("testLogoutWithoutValidTokens", async () => {
    // Arrange
    mockRequest.cookies = {}; // No tokens

    // Act
    await logout(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(logger.warn).toHaveBeenCalledWith(
      "Failed logout attempt",
      expect.any(Object)
    );
    expect(errorResponse).toHaveBeenCalledWith(mockResponse, 401);
    expect(mockResponse.render).toHaveBeenCalledWith("users/dashboard", {
      title: "dashboard",
      message: "unauthorized",
      user: mockRequest.user,
    });
    expect(prisma.session.findUnique).not.toHaveBeenCalled();
    expect(prisma.session.delete).not.toHaveBeenCalled();
    expect(mockResponse.clearCookie).not.toHaveBeenCalled();
  });

  test("testSuccessfulLogout", async () => {
    // Arrange
    mockRequest.cookies = {
      refreshToken: "valid-refresh-token",
      accessToken: "valid-access-token",
    };

    (prisma.session.findUnique as jest.Mock).mockResolvedValue({
      id: "session123",
      token: "valid-refresh-token",
    });
    (prisma.session.delete as jest.Mock).mockResolvedValue({
      id: "session123",
    });

    // Act
    await logout(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(prisma.session.findUnique).toHaveBeenCalledWith({
      where: { token: "valid-refresh-token" },
    });
    expect(prisma.session.delete).toHaveBeenCalledWith({
      where: { token: "valid-refresh-token" },
    });
    expect(mockResponse.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(mockResponse.clearCookie).toHaveBeenCalledWith("accessToken");
    expect(logger.info).toHaveBeenCalledWith(
      "User logged out",
      expect.any(Object)
    );
    expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);

  });

  test("testLoginWithIncorrectPassword", async () => {
    // Arrange
    mockRequest.body = {
      username: "testuser",
      email: "test@example.com",
      password: "wrongpassword",
    };

    const mockUser = {
      id: "user123",
      username: "testuser",
      password: "hashedPassword",
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password doesn't match

    // Act
    await loginUser(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(

      "wrongpassword",
      "hashedPassword"
    );
    expect(logger.warn).toHaveBeenCalledWith(
      "Failed login attempt",
      expect.any(Object)
    );
    expect(errorResponse).toHaveBeenCalledWith(mockResponse, 401);

    expect(generateAccessToken).not.toHaveBeenCalled();
    expect(generateRefreshToken).not.toHaveBeenCalled();
  });
});
 