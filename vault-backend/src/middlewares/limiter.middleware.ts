import redisClient from "../config/redis.config";
import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";


const rateLimiter = rateLimit({
    windowMs: 60 * 1 * 1000,
    max: 13,
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sendCommand: async (...args: [string, ...unknown[]]): Promise<any> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return redisClient.call(...args as [any]);
    }

    })
})

export {rateLimiter}