import { BookingByUser, BookingRecord, BookingUsageSummary, CreateBookingInput } from "../types/booking";

export interface BookingInterface{
    createBooking(data:CreateBookingInput) : Promise<BookingRecord>;
    findById(id: string): Promise<BookingRecord | null>;
    findAll(): Promise<BookingRecord[]>;
    delete(id: string): Promise<boolean>;
    hasOverlap(startTime:Date, endTime:Date) : Promise<boolean>;
    groupByUser() : Promise<BookingByUser[]>;
    usageSummary() : Promise<BookingUsageSummary[]>;
    deleteManyByUserId(userId: string) : Promise<void>;
}
