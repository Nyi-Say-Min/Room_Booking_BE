export type BookingByUser = {
    userId: string;
    userName: string | null;
    bookings: BookingRecord[];
}

export type BookingUsageSummary = {
    userId: string;
    userName: string | null;
    totalBookings: number;
}

export type BookingRecord = {
    id: string;
    userId: string;
    userName?: string | null;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
};

export type CreateBookingInput = {
    userId: string;
    startTime: Date;
    endTime: Date;
}
