import { badRequest, conflict, forbidden, notFound } from "../errors/app_error";
import { BookingInterface } from "../interfaces/booking";
import { UserInterface } from "../interfaces/user";
import { BookingRecord, CreateBookingInput } from "../types/booking";
import { UserDTO } from "../types/user";

export class BookingService{
    constructor(
        private bookingRepository: BookingInterface,
        private userRepository: UserInterface,
    ){}

    async createBooking(data: CreateBookingInput): Promise<BookingRecord>{
        const user = await this.userRepository.findById(data.userId.toString());

        if(!user) {
            throw notFound("User not found");
        }

        if(data.startTime >= data.endTime){
            throw badRequest("StartTime must be before endTime")
        }

        const overlap = await this.bookingRepository.hasOverlap(
            data.startTime,
            data.endTime,
        )

        if(overlap) throw conflict("Booking time overlaps with an existing booking")

        return this.bookingRepository.createBooking(data);
    }

    async listBookings(): Promise<BookingRecord[]> {
        return this.bookingRepository.findAll();
    }

    async deleteBooking(id: string, actor: UserDTO) {
        const booking = await this.bookingRepository.findById(id);

        if(!booking) throw notFound("Booking not found");

        const ownsBooking = booking.userId.toString() === actor.id;
        const canDeleteAny = actor.role === "admin" || actor.role === "owner";

        if(!ownsBooking && !canDeleteAny) {
            throw forbidden("Users can only delete their own bookings");
        }

        return this.bookingRepository.delete(id);
    }

    async groupByUser() {
        return this.bookingRepository.groupByUser();
    }

    async usageSummary() {
        return this.bookingRepository.usageSummary();
    }
}
