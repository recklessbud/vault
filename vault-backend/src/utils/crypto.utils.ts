import crypto from "crypto";
// import e from "express";
// import { text } from "stream/consumers";
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const IV_LENGTH = parseInt(process.env.ENCRYPTION_LENGTH || '16', 10)
console.log(ENCRYPTION_KEY.length)


const encrypt = (text: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex'); 
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted;
}
 
const decrypt = (encrytedData: string) => {
    const [ivHex, encrypted] = encrytedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);	
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { encrypt, decrypt }