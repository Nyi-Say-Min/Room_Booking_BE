import mongoose, { Document, Schema } from "mongoose";
export interface User extends Document {
    id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    role: "admin" | "owner" | "user";
}

const userSchema = new Schema<User>(
    {

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
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
