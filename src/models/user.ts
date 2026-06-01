import mongoose, { Schema } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>(
    {
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "owner", "user"],
        default: "user",
    }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<User>("User", userSchema);