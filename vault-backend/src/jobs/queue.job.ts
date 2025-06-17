import {Queue} from "bullmq";
import { Redis } from "ioredis";

export const configureJob = new Queue("unlock", {
  connection: new Redis(
      // process.env.REDIS_URL!
    {
        host: process.env.REDIS_HOST  ,
        port: Number(process.env.REDIS_PORT)
    }
  ),
});
