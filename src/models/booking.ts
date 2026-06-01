import mongoose, { Schema } from "mongoose";
import { Booking } from "../interfaces/booking";

const bookingSchema = new Schema<Booking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<Booking>("Booking", bookingSchema);