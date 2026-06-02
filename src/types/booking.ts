export type BookingByUser = {
    userId: string;
    bookings: BookingRecord[];
}

export type BookingUsageSummary = {
    userId: string;
    totalBookings: number;
}

export type BookingRecord = {
    id: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
};

export type CreateBookingInput = {
    userId: string;
    startTime: Date;
    endTime: Date;
}
