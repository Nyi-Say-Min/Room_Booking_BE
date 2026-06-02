import express from 'express';
import { UserRepository } from '../repositories/user';
import { UserService } from '../services/user';
import AuthController from '../controllers/auth';
import { BookingRepository } from '../repositories/booking';

const router = express.Router();

export const userRepository = new UserRepository();
const bookingRepository = new BookingRepository();
const userService = new UserService(userRepository, bookingRepository);
const authController = new AuthController(userService);

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

export default router;
