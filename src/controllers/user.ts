import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user";
import { objectIdParamsSchema } from "../validation/params";
import { signupSchema, updateUserRoleSchema } from "../validation/user";

export default class UserController {
    constructor(private userService: UserService) {}

    list = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getUsers();

            return res.status(200).json({
                message: "Users retrieved successfully",
                data: users,
            });
        }catch(error) {
            return next(error);
        }
    }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = signupSchema.parse(req.body);
            const user = await this.userService.createUser(data);

            return res.status(201).json({
                message: "User created successfully",
                data: user,
            });
        }catch(error) {
            return next(error);
        }
    }

    updateRole = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const params = objectIdParamsSchema.parse(req.params);
            const data = updateUserRoleSchema.parse(req.body);
            const user = await this.userService.updateUserRole(params.id, data.role);

            return res.status(200).json({
                message: "User role updated successfully",
                data: user,
            });
        }catch(error) {
            return next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const params = objectIdParamsSchema.parse(req.params);

            await this.userService.deleteUser(params.id);

            return res.status(200).json({
                message: "User and their bookings deleted successfully",
            });
        }catch(error) {
            return next(error);
        }
    }
}
