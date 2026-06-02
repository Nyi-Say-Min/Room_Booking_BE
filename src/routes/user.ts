import express from "express";
import UserController from "../controllers/user";
import { authorize, authenticate } from "../middlewares/auth";
import { BookingRepository } from "../repositories/booking";
import { UserRepository } from "../repositories/user";
import { UserService } from "../services/user";

const router = express.Router();

const userRepository = new UserRepository();
const bookingRepository = new BookingRepository();
const userService = new UserService(userRepository, bookingRepository);
const userController = new UserController(userService);

router.use(authenticate, authorize("admin"));

router.get("/", userController.list);
router.post("/", userController.create);
router.patch("/:id/role", userController.updateRole);
router.delete("/:id", userController.delete);

export default router;
