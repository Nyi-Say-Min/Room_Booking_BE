import { Document } from "mongoose";

export interface User extends Document{
    name: string;
    role: "admin" | "owner" | "user";
}