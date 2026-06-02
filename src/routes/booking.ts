import express from "express";
import { BookingRepository } from "../repositories/booking";
import { BookingService } from "../services/booking";
import BookingController from "../controllers/booking";
import { UserRepository } from "../repositories/user";
import { authorize, authenticate } from "../middlewares/auth";

const router = express.Router();

const bookingRepository = new BookingRepository();
const userRepository = new UserRepository();
const bookingService = new BookingService(bookingRepository, userRepository);
const bookingController = new BookingController(bookingService);

router.use(authenticate);

router.post('/', bookingController.create);
router.get('/', bookingController.list);
router.delete('/:id', bookingController.delete);
router.get('/by-user', authorize("owner", "admin"), bookingController.groupByUser);
router.get('/summary', authorize("owner", "admin"), bookingController.usageSummary);

export default router;
