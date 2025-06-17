// import { title } from "process";
import { z } from "zod";

export const loginSchema = z.object({
    // email: z.string().email(),
    username: z.string().min(3, { message: "Username should be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
});

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3, { message: "Username should be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
    // role: z.enum(["ADMIN", "STUDENT", "SUPERVISOR", "SUPER_ADMIN"]),

})

export const projectTopicSchema = z.object({
    title: z.string(),
})

export const createVaultItemSchema = z.object({
    title: z.string(),
    content: z.string(),
    is: z.date(),
    fileUrl: z.string(),
})

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ProjectTopic = z.infer<typeof projectTopicSchema>;