import { Router } from "express";
import {
  createVaultItem,
  deleteVaultItem,
  getAllUsers,
  getSharedVaults,
  getSingleVaultItem,
  getTotalSharedCount,
  getVaultItems,
  shareUnlockedVaults,
  updateVaultItem,
} from "../controllers/vault.controller";
import { upload } from "../config/multer.config";

// import { authMiddleware } from "../middlewares/auth.middleware";
import { cacheVaultData } from "../middlewares/cache.middleware";
import { authenticateToken, authMiddleware } from "../middlewares/auth.middleware";
// import { cacheMiddleware } from "../middlewares/cache.middleware";

const router = Router();

/**
 * Render the create vault item page.
 */
router.get("/create", (req, res) =>
  res.render("vault/createVault", { title: "Create Vault" })
);

/**
 * Create a new vault item with uploaded files.
 */
router.post("/upload", authMiddleware, upload.array("files"), createVaultItem);

/**
 * Get all vault items for the authenticated user (with caching).
 */
router.get("/", authMiddleware, cacheVaultData(100), getVaultItems);

/**
 * Get details of a single vault item.
 */
router.get("/:vaultId/details", authMiddleware, getSingleVaultItem);

/**
 * Delete a vault item.
 */
router.delete("/:vaultId/delete", authMiddleware, deleteVaultItem);

/**
 * Share an unlocked vault item with another user.
 */
router.post("/:vaultId/share", authMiddleware, shareUnlockedVaults);

/**
 * Get all vault items shared with the authenticated user.
 */
router.get("/shared",authMiddleware, getSharedVaults);

/**
 * Update an existing vault item and upload new files if provided.
 */
router.put("/:vaultId/update", authMiddleware, upload.array("files"), updateVaultItem);

router.get('/users', authMiddleware, getAllUsers)

router.get('/shared/total-count', authMiddleware, getTotalSharedCount)

export default router;
