import mongoose, { Document, Schema } from "mongoose";
export interface Booking extends Document{
    id: string;
    userId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
}

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
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
        }
        
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<Booking>("Booking", bookingSchema);