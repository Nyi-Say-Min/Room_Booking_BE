import mongoose, { Document } from "mongoose";

export interface Booking extends Document{
    userId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
}