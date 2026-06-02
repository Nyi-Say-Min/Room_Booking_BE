import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking";
import { bookingSchema } from "../validation/booking";
import { unauthorized } from "../errors/app_error";
import { objectIdParamsSchema } from "../validation/params";

export default class BookingController{
    constructor(private bookingService: BookingService){}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = bookingSchema.parse(req.body);

            if(!req.currentUser) {
                throw unauthorized();
            }

            const booking = await this.bookingService.createBooking({
                ...data,
                userId: req.currentUser.id,
            });

            return res.status(201).json({
                message: "Booking created successfully",
                data: booking
            })
        }catch (error) {
            return next(error);
        }
    }

    list = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const bookings = await this.bookingService.listBookings();

            return res.status(200).json({
                message: "Bookings retrieved successfully",
                data: bookings,
            });
        }catch(error) {
            return next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.currentUser) {
                throw unauthorized();
            }

            const params = objectIdParamsSchema.parse(req.params);

            await this.bookingService.deleteBooking(params.id, req.currentUser);

            return res.status(200).json({
                message: "Booking deleted successfully",
            });
        }catch(error) {
            return next(error);
        }
    }

    groupByUser = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const groupedBookings = await this.bookingService.groupByUser();

            return res.status(200).json({
                message: "Bookings grouped by user retrieved successfully",
                data: groupedBookings,
            });
        }catch(error) {
            return next(error);
        }
    }

    usageSummary = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const summary = await this.bookingService.usageSummary();

            return res.status(200).json({
                message: "Booking usage summary retrieved successfully",
                data: summary,
            });
        }catch(error) {
            return next(error);
        }
    }
}
