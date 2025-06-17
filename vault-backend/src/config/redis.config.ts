import {Redis} from "ioredis";

export const redisClient = new Redis(
    // process.env.REDIS_URL!
    {
        host: process.env.REDIS_HOST  ,
        port: Number(process.env.REDIS_PORT)
    }
    )


redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export default redisClient;