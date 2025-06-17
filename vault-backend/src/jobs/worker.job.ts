#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { Worker } from 'bullmq'
import {Redis} from 'ioredis'
import { sendEEmail } from '../services/email.service'


const prisma = new PrismaClient()

const unclockWorker = new Worker('unlock', async (job) => {
    const { vaultItemId } = job.data

    const item = await prisma.vaultItem.findUnique({
        where: {
            id: vaultItemId
        }, 
        include:{
            user: true
        }
    })
    if(!item){
        throw new Error('Item not found')
    }
    if(new Date(item.unlockAt) <= new Date()){
        await prisma.vaultItem.update({
            where: {
                id: vaultItemId
            },
            data: {
                unlocked: true
            }
        })
        try {
            await sendEEmail(item.user.email, 'Item Unlocked', 'Your item has been unlocked')
        } catch (error) {
            console.log(error)
        }
    }else{
        throw new Error('Item not unlocked')
    }
}, 
{
    connection: new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        maxRetriesPerRequest: null
    }),
})

unclockWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
})
unclockWorker.on('progress', (job) => {
    console.log(`Job ${job.id} in progress`);
})

unclockWorker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed`, err);
})

console.log('worker started')