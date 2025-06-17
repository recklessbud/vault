/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import {
  errorResponse,
  successResponse,
} from "../../src/utils/responses.utils";
import prisma from "../../src/config/dbconn";
import { logger } from "../../src/utils/logger";
import {
  uploadFile,
  getFileUrl,
  deleteFile,
} from "../../src/services/awsS3.services";
import { encrypt, decrypt } from "../../src/utils/crypto.utils";
import { configureJob } from "../../src/jobs/queue.job";
import { sendEEmail } from "../../src/services/email.service";
import {
  createVaultItem,
  getVaultItems,
  getSingleVaultItem,
  deleteVaultItem,
} from "../../src/controllers/vault.controller";
import { create } from "domain";
import exp from "constants";

// Mock dependencies
jest.mock("../../src/utils/responses.utils");
jest.mock("../../src/config/dbconn", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    vaultItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));
jest.mock("../../src/utils/logger");
jest.mock("../../src/services/awsS3.services");
jest.mock("../../src/utils/crypto.utils");
jest.mock("../../src/jobs/queue.job");
jest.mock("../../src/services/email.service");

describe("Vault Controller", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: Partial<any>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      user: { id: "user123" },
      body: {},
      params: {},
      path: "/vault",
      file: {
        originalname: "test-file.txt",
        buffer: Buffer.from("test"),
        mimetype: "text/plain",
      } as Express.Multer.File,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
    };

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    (errorResponse as jest.Mock).mockReturnValue(mockResponse);
    (successResponse as jest.Mock).mockReturnValue(mockResponse);
  });

  describe("createVaultItem", () => {
    test("testSuccessfulVaultItemCreation", async () => {
      // Arrange
      mockRequest.body = {
        title: "Test Vault",
        content: "Secret content",
        unlockAt: "2023-12-31T00:00:00.000Z",
      };

      const mockUser = { id: "user123", email: "user@example.com" };
      const mockVaultItem = {
        id: "vault123",
        title: "Test Vault",
        content: "encrypted-content",
        unlockAt: new Date("2023-12-31"),
        userId: "user123",
        fileUrl:
          "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt",
        isEncrypted: true,
        unlocked: false,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (uploadFile as jest.Mock).mockResolvedValue(
        "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt"
      );
      (encrypt as jest.Mock).mockReturnValue("encrypted-content");
      (prisma.vaultItem.create as jest.Mock).mockResolvedValue(mockVaultItem);
      (configureJob.add as jest.Mock).mockResolvedValue(undefined);
      (sendEEmail as jest.Mock).mockResolvedValue(undefined);

      // Act
      await createVaultItem(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(encrypt).toHaveBeenCalledWith("Secret content");
      expect(uploadFile).toHaveBeenCalled();
      expect(prisma.vaultItem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "Test Vault",
          content: "encrypted-content",
          unlockAt: expect.any(Date),
          userId: "user123",
        }),
      });
      expect(configureJob.add).toHaveBeenCalled();
      expect(sendEEmail).toHaveBeenCalledWith(
        "user@example.com",
        "Vault Item Created",
        expect.stringContaining("Test Vault")
      );
      expect(successResponse).toHaveBeenCalledWith(mockResponse, 201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVaultItem);
    });

    test("testMissingRequiredFieldsValidation", async () => {
      // Arrange
      mockRequest.body = {
        title: "Test Vault",
        // Missing content and unlockAt
      };

      // Act
      await createVaultItem(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(errorResponse).toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });
    test("CreateVaultItem_UserNotFound", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      await createVaultItem(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Failed Vault Item Creation Attempt",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
      expect(mockResponse.render).toHaveBeenCalledWith("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
    });
    test("CreateVaultItem_FileNotProvided", async () => {
      await createVaultItem(mockRequest as Request, mockResponse as Response);
      expect(errorResponse).toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
    });

    test("testFileUploadFailure", async () => {
      // Arrange
      mockRequest.body = {
        title: "Test Vault",
        content: "Secret content",
        unlockAt: "2023-12-31T00:00:00.000Z",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user123",
        email: "user@example.com",
      });
      (uploadFile as jest.Mock).mockRejectedValue(
        new Error("S3 upload failed")
      );

      // Act
      await createVaultItem(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(uploadFile).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        "File upload failed",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    test("testBackgroundJobSchedulingFailure", async () => {
      // Arrange
      mockRequest.body = {
        title: "Test Vault",
        content: "Secret content",
        unlockAt: "2023-12-31T00:00:00.000Z",
      };

      const mockUser = { id: "user123", email: "user@example.com" };
      const mockVaultItem = {
        id: "vault123",
        title: "Test Vault",
        content: "encrypted-content",
        unlockAt: new Date("2023-12-31"),
        userId: "user123",
        fileUrl:
          "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt",
        isEncrypted: true,
        unlocked: false,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (uploadFile as jest.Mock).mockResolvedValue(
        "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt"
      );
      (encrypt as jest.Mock).mockReturnValue("encrypted-content");
      (prisma.vaultItem.create as jest.Mock).mockResolvedValue(mockVaultItem);
      (configureJob.add as jest.Mock).mockRejectedValue(
        new Error("Redis connection failed")
      );
      (sendEEmail as jest.Mock).mockResolvedValue(undefined);

      // Act
      await createVaultItem(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.vaultItem.create).toHaveBeenCalled();
      expect(configureJob.add).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        "Vault item creation failed",
        expect.any(Object)
      );
      // The function should still complete successfully since the item was created
      expect(successResponse).toHaveBeenCalledWith(mockResponse, 201);
    });

    // test("testEmailNotificationAfterVaultItemCreation", async () => {
    //   // Arrange
    //   mockRequest.body = {
    //     title: "Test Vault",
    //     content: "Secret content",
    //     unlockAt: "2023-12-31T00:00:00.000Z",
    //   };

    //   const mockUser = { id: "user123", email: "user@example.com" };
    //   const mockVaultItem = {
    //     id: "vault123",
    //     title: "Test Vault",
    //     content: "encrypted-content",
    //     unlockAt: new Date("2023-12-31"),
    //     userId: "user123",
    //     fileUrl:
    //       "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt",
    //     isEncrypted: true,
    //     unlocked: false,
    //     createdAt: new Date(),
    //   };

    //   (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    //   (uploadFile as jest.Mock).mockResolvedValue(
    //     "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt"
    //   );
    //   (encrypt as jest.Mock).mockReturnValue("encrypted-content");
    //   (prisma.vaultItem.create as jest.Mock).mockResolvedValue(mockVaultItem);
    //   (configureJob.add as jest.Mock).mockResolvedValue(undefined);
    //   (sendEEmail as jest.Mock).mockResolvedValue(undefined);

    //   // Act
    //   await createVaultItem(mockRequest as Request, mockResponse as Response);

    //   // Assert

    //   expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
    // });
  });

  describe("getVaultItems", () => {
    test("testGetAllVaultItems", async () => {
      // Arrange
      const mockUser = {
        id: "user123",
        vaultItem: [
          {
            id: "vault123",
            title: "Test Vault",
            content: "encrypted-content",
            unlockAt: new Date(),
            userId: "user123",
            fileUrl: "https://example.com/file.txt",
          },
        ],
      };

      const mockVaultItems = [
        {
          id: "vault123",
          title: "Test Vault",
          content: "encrypted-content",
          unlockAt: new Date(),
          userId: "user123",
          fileUrl: "https://example.com/file.txt",
        },
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.vaultItem.findMany as jest.Mock).mockResolvedValue(
        mockVaultItems
      );

      // Act
      await getVaultItems(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        include: { vaultItem: true },
      });
      expect(prisma.vaultItem.findMany).toHaveBeenCalledWith({
        where: { userId: "user123" },
      });
      expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
    });

    test("testUserNotFoundWhenRetrievingVaultItems", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      await getVaultItems(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        include: { vaultItem: true },
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Failed to get vault items",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
      expect(mockResponse.render).toHaveBeenCalledWith(
        "errors/404",
        expect.any(Object)
      );
    });

    test("testNoVaultItemsFound", async () => {
      // Arrange
      const mockUser = {
        id: "user123",
        vaultItem: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.vaultItem.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      await getVaultItems(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(prisma.vaultItem.findMany).toHaveBeenCalledWith({
        where: { userId: "user123" },
      });
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "No vault items found",
      });
    });
  });

  describe("getSingleVaultItem", () => {
    test("testGetAndDecryptSingleVaultItem", async () => {
      // Arrange
      mockRequest.params = { vaultid: "vault123" };

      const mockUser = {
        id: "user123",
        vaultItem: [
          {
            id: "vault123",
            title: "Test Vault",
            content: "encrypted-content",
            unlockAt: new Date(),
            userId: "user123",
            fileUrl: "https://example.com/file.txt",
          },
        ],
      };

      const mockVaultItem = {
        id: "vault123",
        title: "Test Vault",
        content: "encrypted-content",
        unlockAt: new Date(),
        userId: "user123",
        fileUrl: "https://example.com/file.txt",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.vaultItem.findUnique as jest.Mock).mockResolvedValue(
        mockVaultItem
      );
      (decrypt as jest.Mock).mockReturnValue("decrypted-content");

      // Act
      await getSingleVaultItem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        include: { vaultItem: true },
      });
      expect(prisma.vaultItem.findUnique).toHaveBeenCalledWith({
        where: {
          id: "vault123",
          userId: "user123",
        },
      });
      expect(decrypt).toHaveBeenCalledWith("encrypted-content");
      expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        fileUrl: "https://example.com/file.txt",
        decryptedContent: "decrypted-content",
      });
    });

    test("testVaultItemNotFound", async () => {
      // Arrange
      mockRequest.params = { vaultid: "nonexistent" };

      const mockUser = {
        id: "user123",
        vaultItem: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.vaultItem.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      await getSingleVaultItem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(prisma.vaultItem.findUnique).toHaveBeenCalledWith({
        where: {
          id: undefined,
          unlocked: true
        },
        include: { files: true },
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Failed to get vault item",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
      expect(mockResponse.render).toHaveBeenCalledWith(
        "errors/404",
        expect.any(Object)
      );
    });
  });

  describe("deleteVaultItem", () => {
    test("should delete a vault item and its file successfully", async () => {
      mockRequest.params = { vaultId: "vault123" };
      const mockUser = {
        id: "user123",
        vaultItem: [
          {
            id: "vault123",
            fileUrl:
              "https://bucket.s3.region.amazonaws.com/vault/user123/file.txt",
          },
        ],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.$transaction as jest.Mock).mockImplementation(
        async (cb) => await cb(prisma)
      );
      (deleteFile as jest.Mock).mockResolvedValue(undefined);

      await deleteVaultItem(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        include: {
          vaultItem: {
            where: { id: "vault123" },
          },
          include: { files: true },
        },
      });
      expect(deleteFile).toHaveBeenCalledWith("vault/user123/file.txt");
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Vault item deleted successfully" })
      );
    });

    test("should return 404 if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteVaultItem(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        include: {
          vaultItem: {
            where: { id: undefined },
            include: { files: true },
          },
        },
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Failed to delete vault item",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
      expect(mockResponse.render).toHaveBeenCalledWith("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
    });

    test("should handle errors during deletion (e.g., invalid file URL)", async () => {
      mockRequest.params = { vaultId: "vault123" };
      const mockUser = {
        id: "user123",
        vaultItem: [
          {
            id: "vault123",
            fileUrl: "invalid-url",
          },
        ],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error("Invalid URL")
      );

      await deleteVaultItem(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to delete vault item",
        expect.any(Object)
      );
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});
