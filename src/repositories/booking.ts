import { BookingInterface } from "../interfaces/booking";
import booking, { Booking } from "../models/booking";
import { BookingByUser, BookingRecord, BookingUsageSummary, CreateBookingInput } from "../types/booking";
import { BaseRepository } from "./base_repository";
import mongoose from "mongoose";

function toBookingRecord(document: Booking): BookingRecord {
    return {
        id: document.id.toString(),
        userId: document.userId.toString(),
        startTime: document.startTime,
        endTime: document.endTime,
        createdAt: document.createdAt,
    };
}

export class BookingRepository extends BaseRepository<Booking> implements BookingInterface {
    constructor() {
        super(booking);
    }

    async createBooking(data: CreateBookingInput): Promise<BookingRecord> {
       const createdBooking = await this.createDocument({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
       } as Partial<Booking>);
       return toBookingRecord(createdBooking);
    }

    async findById(id: string): Promise<BookingRecord | null> {
        const existingBooking = await this.findDocumentById(id);
        return existingBooking ? toBookingRecord(existingBooking) : null;
    }

    async findAll(): Promise<BookingRecord[]> {
        const bookings = await this.findAllDocuments();
        return bookings.map(toBookingRecord);
    }

    async delete(id: string): Promise<boolean> {
        return this.deleteDocument(id);
    }

    async hasOverlap(startTime: Date, endTime: Date): Promise<boolean> {
        const existing = await this.model.findOne({
            $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gt: startTime } },
            ]
        });

        return !!existing;
    }

    async groupByUser(): Promise<BookingByUser[]> {
        return this.model.aggregate([
            { $sort: { startTime: 1 } },
            {
                $group: {
                    _id: "$userId",
                    bookings: {
                        $push: {
                            id: { $toString: "$_id" },
                            userId: { $toString: "$userId" },
                            startTime: "$startTime",
                            endTime: "$endTime",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
            { $project: { _id: 0, userId: { $toString: "$_id" }, bookings: 1 } },
        ]);
    }

    async usageSummary(): Promise<BookingUsageSummary[]> {
        return this.model.aggregate([
            { $group: { _id: "$userId", totalBookings: { $sum: 1 } } },
            { $sort: { totalBookings: -1 } },
            { $project: { _id: 0, userId: { $toString: "$_id" }, totalBookings: 1 } },
        ]);
    }

    async deleteManyByUserId(userId: string): Promise<void> {
        await this.model.deleteMany({ userId });
    }
}
