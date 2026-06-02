import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../errors/app_error";
import { BookingInterface } from "../interfaces/booking";
import { UserInterface } from "../interfaces/user";
import { BookingService } from "../services/booking";
import { UserService } from "../services/user";
import { BookingByUser, BookingRecord, BookingUsageSummary, CreateBookingInput } from "../types/booking";
import { CreateUserInput, Role, UserRecord } from "../types/user";

class FakeBookingRepository implements BookingInterface {
    public bookings: BookingRecord[];

    constructor(bookings: BookingRecord[] = []) {
        this.bookings = [...bookings];
    }

    async createBooking(data: CreateBookingInput): Promise<BookingRecord> {
        const booking: BookingRecord = {
            id: `booking-${this.bookings.length + 1}`,
            userId: data.userId,
            startTime: data.startTime,
            endTime: data.endTime,
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
        };

        this.bookings.push(booking);
        return booking;
    }

    async findById(id: string): Promise<BookingRecord | null> {
        return this.bookings.find((booking) => booking.id === id) ?? null;
    }

    async findAll(): Promise<BookingRecord[]> {
        return this.bookings;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.bookings.length;
        this.bookings = this.bookings.filter((booking) => booking.id !== id);
        return this.bookings.length !== initialLength;
    }

    async hasOverlap(startTime: Date, endTime: Date): Promise<boolean> {
        return this.bookings.some((booking) => booking.startTime < endTime && booking.endTime > startTime);
    }

    async groupByUser(): Promise<BookingByUser[]> {
        const grouped = new Map<string, BookingRecord[]>();

        for(const booking of this.bookings) {
            grouped.set(booking.userId, [...(grouped.get(booking.userId) ?? []), booking]);
        }

        return [...grouped.entries()].map(([userId, bookings]) => ({ userId, bookings }));
    }

    async usageSummary(): Promise<BookingUsageSummary[]> {
        const grouped = await this.groupByUser();
        return grouped.map(({ userId, bookings }) => ({ userId, totalBookings: bookings.length }));
    }

    async deleteManyByUserId(userId: string): Promise<void> {
        this.bookings = this.bookings.filter((booking) => booking.userId !== userId);
    }
}

class FakeUserRepository implements UserInterface {
    public users: UserRecord[];

    constructor(users: UserRecord[] = []) {
        this.users = [...users];
    }

    async createUser(data: CreateUserInput): Promise<UserRecord> {
        const user: UserRecord = {
            id: `user-${this.users.length + 1}`,
            name: data.name,
            password: data.password,
            role: data.role ?? "user",
        };

        this.users.push(user);
        return user;
    }

    async findById(id: string): Promise<UserRecord | null> {
        return this.users.find((user) => user.id === id) ?? null;
    }

    async findByName(name: string): Promise<UserRecord | null> {
        return this.users.find((user) => user.name === name) ?? null;
    }

    async findAll(): Promise<UserRecord[]> {
        return this.users;
    }

    async updateRole(id: string, role: Role): Promise<UserRecord | null> {
        const user = await this.findById(id);

        if(!user) {
            return null;
        }

        user.role = role;
        return user;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.users.length;
        this.users = this.users.filter((user) => user.id !== id);
        return this.users.length !== initialLength;
    }
}

const existingBooking: BookingRecord = {
    id: "booking-1",
    userId: "user-1",
    startTime: new Date("2026-01-01T10:00:00.000Z"),
    endTime: new Date("2026-01-01T11:00:00.000Z"),
    createdAt: new Date("2026-01-01T09:00:00.000Z"),
};

const user: UserRecord = {
    id: "user-1",
    name: "Alice",
    password: "hashed-password",
    role: "user",
};

function assertAppError(error: unknown, statusCode: number) {
    assert.ok(error instanceof AppError);
    assert.equal(error.statusCode, statusCode);
}

test("booking overlap blocks identical, partial, and contained ranges", async () => {
    const service = new BookingService(
        new FakeBookingRepository([existingBooking]),
        new FakeUserRepository([user]),
    );

    const overlappingRanges = [
        ["2026-01-01T10:00:00.000Z", "2026-01-01T11:00:00.000Z"],
        ["2026-01-01T10:30:00.000Z", "2026-01-01T11:30:00.000Z"],
        ["2026-01-01T10:15:00.000Z", "2026-01-01T10:45:00.000Z"],
        ["2026-01-01T09:30:00.000Z", "2026-01-01T11:30:00.000Z"],
    ];

    for(const [startTime, endTime] of overlappingRanges) {
        await assert.rejects(
            () => service.createBooking({
                userId: user.id,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            }),
            (error) => {
                assertAppError(error, 409);
                return true;
            },
        );
    }
});

test("booking rules allow back-to-back bookings and reject invalid ranges", async () => {
    const service = new BookingService(
        new FakeBookingRepository([existingBooking]),
        new FakeUserRepository([user]),
    );

    const booking = await service.createBooking({
        userId: user.id,
        startTime: new Date("2026-01-01T11:00:00.000Z"),
        endTime: new Date("2026-01-01T12:00:00.000Z"),
    });

    assert.equal(booking.startTime.toISOString(), "2026-01-01T11:00:00.000Z");

    await assert.rejects(
        () => service.createBooking({
            userId: user.id,
            startTime: new Date("2026-01-01T12:00:00.000Z"),
            endTime: new Date("2026-01-01T12:00:00.000Z"),
        }),
        (error) => {
            assertAppError(error, 400);
            return true;
        },
    );
});

test("booking deletion enforces role permissions", async () => {
    const userRepository = new FakeUserRepository([user]);
    const bookingRepository = new FakeBookingRepository([existingBooking]);
    const service = new BookingService(bookingRepository, userRepository);

    await assert.rejects(
        () => service.deleteBooking(existingBooking.id, { id: "user-2", name: "Bob", role: "user" }),
        (error) => {
            assertAppError(error, 403);
            return true;
        },
    );

    await service.deleteBooking(existingBooking.id, { id: "admin-1", name: "Admin", role: "admin" });
    assert.equal(bookingRepository.bookings.length, 0);
});

test("user service returns safe DTOs and cascades bookings on delete", async () => {
    const userRepository = new FakeUserRepository([user]);
    const bookingRepository = new FakeBookingRepository([existingBooking]);
    const service = new UserService(userRepository, bookingRepository);

    const users = await service.getUsers();
    assert.deepEqual(users, [{ id: "user-1", name: "Alice", role: "user" }]);

    await service.deleteUser(user.id);
    assert.equal(userRepository.users.length, 0);
    assert.equal(bookingRepository.bookings.length, 0);
});
