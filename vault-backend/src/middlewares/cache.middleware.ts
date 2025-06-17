import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.config';
import { logger } from '../utils/logger';

/**
 * Cache middleware for vault data
 * @param {number} duration - The duration in seconds of the cache
 * @returns {function(Request, Response, NextFunction)} - The middleware function
 */
export const cacheVaultData = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract user ID and vault ID from the request
      const userId = req.user?.id;
    //   const vaultId = req.params.vaultId; // Assuming vaultId is in the route params

      if (!userId) {
        logger.warn('User ID or Vault ID missing, skipping cache.');
        return next();
      }

      // Generate a cache key based on user ID and vault ID
      const key = `cache:vault:${userId}:vaults`;

      // Check if the data is cached
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        logger.info(`Cache hit for vault data: ${key}`);
        // Return the cached data
        res.json(JSON.parse(cachedData));
        return;
      }

      // Overwrite the original res.json method to cache the data
      const originalJson = res.json;
      res.json = function (data) {
        // Cache the data
        redisClient.setex(key, duration, JSON.stringify(data));
        logger.info(`Cache set for vault data: ${key}`);
        // Call the original res.json method with the cached data
        return originalJson.call(this, data);
      };

      // Continue with the next middleware
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      // Continue with the next middleware
      next();
    }
  };
};