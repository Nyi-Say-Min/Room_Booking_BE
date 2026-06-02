import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "owner", "user"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const signinSchema = z.object({
    name: z.string(),
    password: z.string(),
});

export const updateUserRoleSchema = z.object({
    role: z.enum(["admin", "owner", "user"]),
});
