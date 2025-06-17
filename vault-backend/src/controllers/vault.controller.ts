/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses.utils";
import prisma from "../config/dbconn";
import { logger } from "../utils/logger";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { uploadFile, getFileUrl, deleteFile } from "../services/awsS3.services";
import { encrypt, decrypt } from "../utils/crypto.utils";
import { VaultItems } from "../typesv/alltypes";
import { configureJob } from "../jobs/queue.job";


/**
 * Creates a new vault item for the authenticated user, uploads files to S3, encrypts content,
 * schedules unlock job, and sends a notification email.
 */
export const createVaultItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content, unlockAt, message } = req.body;

  if (!title || !content || !unlockAt) {
    errorResponse(res, 400).json({ message: "All fields are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        vaultItem: true,
      },
    });

    if (!user) {
      logger.warn("Failed Vault Item Creation Attempt", {
        userId: req.user?.id,
        path: req.path,
        reason: "User not found",
      });
      return errorResponse(res, 404).render("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
    }


    if (user && user.vaultItem.some((item) => item.title === title)) {
      errorResponse(res, 400).json({
        message: "Vault Item with the same title already exists",
      });
      return;
    }
    console.log(req.files);

    const encryptedContent = encrypt(content);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedFiles: any =
      req.files && Array.isArray(req.files)
        ? await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req.files?.map(async (file: any) => {
              try {
                const key = `vault/${
                  req.user?.id
                }/${Date.now()}-${file.originalname.trim()}`;
                const files = await uploadFile(file, key);
                return {
                  url: files,
                  fileName: file.originalname.trim(),
                };
              } catch (error) {
                console.error("File upload failed:", error);
              }
            })
          )
        : [];
    const calculateDaysLeft =
      (new Date(unlockAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const encryptedMessage = message ? encrypt(message) : null;

    const vaultItem: VaultItems = await prisma.vaultItem.create({
      data: {
        title,
        content: encryptedContent,
        unlockAt: new Date(unlockAt),
        userId: user.id,
        files: {
          create: uploadedFiles,
        },
        daysLeft: calculateDaysLeft,
        message: encryptedMessage
      },
    });
  
    try {
      await Promise.all([
        configureJob.add(
          "unlockVaultIten",
          {
            vaultItemId: vaultItem.id,
          },
          {
            delay: new Date(vaultItem.unlockAt).getTime() - Date.now(),
            attempts: 3,
          }
        ),
      ]);
      console.log("Background job scheduled and email sent.");
    } catch (error) {
      console.log(error);
      logger.error("Vault item post-creation task failed", {
        error,
        userId: req.user?.id,
        path: req.path,
      });
    }

    successResponse(res, 201).json(vaultItem);
  } catch (error) {
    console.log("error:", error);
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.files?.map(async (file: any) => {
          try {
            const key = `vault/${
              req.user?.id
            }/${Date.now()}-${file.originalname.trim()}`;
            const files = await deleteFile(key);
            return files;
          } catch (error) {
            console.error("File upload failed:", error);
          }
        })
      );
    }

    logger.error("Vault item creation failed", {
      error,
      userId: req.user?.id,
      path: req.path,
    });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
    return;
  }
};

/**
 * Retrieves all vault items for the authenticated user, decrypts content, and returns them.
 */
export const getVaultItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        vaultItem: true,
      },
    });
    if (!user) {
      logger.warn("Failed to get vault items", {
        userId: req.user?.id,
        path: req.path,
        reason: "User not found",
      });
      errorResponse(res, 404).render("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
    }

    const vaultItems = await prisma.vaultItem.findMany({
      where: {
        userId: req.user?.id,
      },
    });
    if (vaultItems.length === 0) {
      errorResponse(res, 404).json({ message: "No vault items found" });
      return;
    }
    const decryptedVaultItems = vaultItems.map((item: any) => {
      return {
        ...item,
        content: decrypt(item.content),
        unlockAt: item.unlockAt
          ? new Date(item.unlockAt).toISOString().split("T")[0]
          : null,
      };
    });
    successResponse(res, 200).json(decryptedVaultItems);
  } catch (error) {
    logger.error("Failed to get vault items", {
      error,
      userId: req.user?.id,
      path: req.path,
    });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
    return;
  }
};

/**
 * Retrieves a single unlocked vault item for the authenticated user, decrypts content, and returns it.
 */
export const getSingleVaultItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { vaultId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        vaultItem: true,
      },
    });
    if (!user) {
      logger.warn("Failed to get vault item", {
        userId: req.user?.id,
        path: req.path,
        reason: "User not found",
      });
      errorResponse(res, 404).render("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
      return;
    }
    const vaultItem = await prisma.vaultItem.findUnique({
      where: {
        id: vaultId,
        unlocked: true,
      },
      include: {
        files: true,
      },
    });
    if (!vaultItem) {
      logger.warn("Failed to get vault item", {
        userId: req.user?.id,
        path: req.path,
        reason: "Vault item not found",
      });
      errorResponse(res, 404).render("errors/404", {
        title: "404 - Not Found",
        message: "Vault item not found",
      });
      return;
    }
    const decryptedVaultItem = {
      ...vaultItem,
      content: decrypt(vaultItem.content as string),
      unlockAt: vaultItem.unlockAt
        ? new Date(vaultItem.unlockAt).toISOString().split("T")[0]
        : null,
      createdAt: new Date(vaultItem.createdAt).toISOString().split("T")[0],
      files: vaultItem.files,
      unlocked: vaultItem.unlocked,
    };
    successResponse(res, 200).json(decryptedVaultItem);
  } catch (error) {
    logger.error("Failed to get vault item", {
      error,
      userId: req.user?.id,
      path: req.path,
    });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
    return;
  }
};

/**
 * Updates an existing vault item for the authenticated user, uploads new files if provided,
 * and updates encrypted content and unlock date.
 */
export const updateVaultItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { vaultId } = req.params;
  const { content, unlockAt, title } = req.body;
  try {
    if (!title || !content || !unlockAt) {
      errorResponse(res, 400).json({ message: "All fields are required" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        vaultItem: true,
      },
    });
    if (!user) {
      logger.warn("Failed to update vault item", {
        userId: req.user?.id,
        path: req.path,
        reason: "User not found",
      });
      errorResponse(res, 400).json({ message: "User not found" });
      return;
    }
    const uploadedFiles: any =
      req.files && Array.isArray(req.files)
        ? await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req.files?.map(async (file: any) => {
              try {
                const key = `vault/${
                  req.user?.id
                }/${Date.now()}-${file.originalname.trim()}`;
                const files = await uploadFile(file, key);
                return {
                  url: files,
                  fileName: file.originalname.trim(),
                };
              } catch (error) {
                console.error("File upload failed:", error);
              }
            })
          )
        : [];

    const calculateDaysLeft = (new Date(unlockAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    
    const updatedVaultItem = await prisma.vaultItem.update({
      where: {
        id: vaultId,
        userId: req.user?.id,
      },
      data: {
        content: encrypt(content),
        unlockAt: new Date(unlockAt),
        title,
        files: {
          create: uploadedFiles,
        },
        daysLeft: calculateDaysLeft,
        unlocked: false,
      },
    });
    successResponse(res, 200).json(updatedVaultItem);
  } catch (error) {
    console.log(error);
    logger.error("Failed to update vault item", {
      error,
      userId: req.user?.id,
      // path: req.path,
    });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
    return;
  }
};

/**
 * Deletes a vault item and its associated files from S3 for the authenticated user.
 */
export const deleteVaultItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { vaultId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        vaultItem: {
          where: {
            id: vaultId,
          },
          include: {
            files: true, // Include files associated with the vault item
          },
        },
      },
    });
    if (!user) {
      logger.warn("Failed to delete vault item", {
        userId: req.user?.id,
        path: req.path,
        reason: "User not found",
      });
      errorResponse(res, 404).render("errors/404", {
        title: "404 - Not Found",
        message: "User not found",
      });
      return;
    }
    const vaultItem = user.vaultItem[0];
    if (!vaultItem) {
      logger.warn("Vault item not found for deletion", {
        vaultId,
        userId: req.user?.id,
        path: req.path,
      });
      errorResponse(res, 404).json({ message: "Vault item not found" });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fileUrl = vaultItem.files.map((files) => {
      return files.url;
    });
    const fileKey = fileUrl
      .map((urls) => {
        try {
          return new URL(urls).pathname.slice(1);
        } catch (error) {
          logger.error("Error parsing url", { error });
          return null;
        }
      })
      .filter(Boolean) as string[];
    // new URL(fileUrl).pathname.slice(1) : null;
    console.log(fileKey);
    const deletedVaultItem = await prisma.$transaction(async (prisma) => {
      await Promise.all(
        fileKey.map(async (key) => {
          try {
            await deleteFile(key as string);
            logger.info("File deleted from S3", { key });
          } catch (error) {
            logger.error("Failed to delete file from S3", {
              error,
            });
          }
        })
      );

      await prisma.files.deleteMany({
        where: {
          vaultItemId: vaultId,
        },
      });
        
      await prisma.shareVaultItem.deleteMany({
        where: {
          vaultItemId: vaultId,
        },
      })

      await prisma.vaultItem.delete({
        where: {
          id: vaultId,
        },
      });
      

    });

    successResponse(res, 200).json({
      message: "Vault item deleted successfully",
      deletedVaultItem,
    });
  } catch (error) {
    console.log(error);
    logger.error("Failed to delete vault item", {
      error,
      userId: req.user?.id,
      path: req.path,
    });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
    return;
  }
};

/**
 * Shares an unlocked vault item with another user by creating a share record.
 */
export const shareUnlockedVaults = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { vaultId } = req.params;
  const { recipientName } = req.body;
  try {
    const senderUserId = req.user?.id;
    const recipientDetails = await prisma.user.findUnique({
      where: { username: recipientName },
    });

    if (!recipientDetails) {
      errorResponse(res, 403).json({
        message: "Unauthorized or vault not found",
      });
      return;
    }
    const vaultItem = await prisma.vaultItem.findUnique({
      where: {
        id: vaultId,
      },
    });

    if (!vaultItem || vaultItem.userId !== senderUserId) {
      errorResponse(res, 403).json({
        message: "Unauthorized or vault not found",
      });
      return;
    }

    if (new Date() < new Date(vaultItem.unlockAt)) {
      errorResponse(res, 403).json({
        message: "vault item is not unlocked yet",
      });
      return;
    }

    const sharedData = await prisma.shareVaultItem.create({
      data: {
        vaultItemId: vaultItem.id,
        sharedById: senderUserId,
        shareWithId: recipientDetails.id,
      },
    });

    successResponse(res, 200).json({
      message: "vault item shared successfully",
      sharedData,
    });
  } catch (error) {
    console.log(error);
    logger.error("Failed Sharing vault", {
      error,
    });
    errorResponse(res, 500).json({ message: "internal server error" });
    return;
  }
};

/**
 * Retrieves all vault items shared with the authenticated user.
 */
export const getSharedVaults = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const sharedItems = await prisma.shareVaultItem.findMany({
      where: { shareWithId: userId },
      include: { 
        vaultItem: {
          include: { files: true }
        },
        sharedBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const sharedVaultItems = sharedItems.map((item) => ({
      ...item,
      vaultItem: item.vaultItem
        ? {
            ...item.vaultItem,
            content: item.vaultItem.content ? decrypt(item.vaultItem.content) : null,
            unlockAt: item.vaultItem.unlockAt
              ? new Date(item.vaultItem.unlockAt).toISOString().split("T")[0]
              : null,
            createdAt: item.vaultItem.createdAt
              ? new Date(item.vaultItem.createdAt).toISOString().split("T")[0]
              : null,
          }
        : null,
      sharedBy: item.sharedBy,
    }));

    successResponse(res, 200).json(sharedVaultItems);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500).json({
      message: "Failed to retrieve shared vaults",
    });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const excludeLoggedInUser = users.filter((user) => user.id !== req.user?.id);
    successResponse(res, 200).json(excludeLoggedInUser);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500).json({
      message: "Failed to retrieve users",
    });
  }
};


export const getTotalSharedCount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const count = await prisma.shareVaultItem.count({
      where: {
        shareWithId: userId,
      },
    });
    successResponse(res, 200).json( count );
  } catch (error) {
    logger.error("Failed to get total shared count", { error, userId });
    errorResponse(res, 500).json({ message: "Internal Server Error" });
  }
};