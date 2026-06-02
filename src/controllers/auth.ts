import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user";
import { signinSchema, signupSchema } from "../validation/user";

export default class AuthController {
    constructor(private userService: UserService) {}

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = signupSchema.parse(req.body);

            const user = await this.userService.bootstrapSignup(validatedData);

            return res.status(201).json({
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            return next(error);
        }
    };

    signin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = signinSchema.parse(req.body);

            const user = await this.userService.authenticateUser(validatedData);

            return res.status(200).json({
                message: "User authenticated successfully",
                data: user,
            });
        } catch (error) {
            return next(error);
        }
    };
}
