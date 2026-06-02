import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user";
import { Role, UserDTO } from "../types/user";
import { forbidden, unauthorized } from "../errors/app_error";
import mongoose from "mongoose";

declare global{
    namespace Express{
        interface Request{
            currentUser?: UserDTO;
        }
    }
}

const userRepository = new UserRepository();

export async function authenticate(req: Request, _res: Response, next: NextFunction ) {
    try {
        const userId = req.header("X-User-Id");

        if(!userId) return next(unauthorized("Missing X-User-Id header"));
        if(!mongoose.Types.ObjectId.isValid(userId)) return next(unauthorized("Invalid user"));

        const user = await userRepository.findById(userId);

        if(!user) return next(unauthorized("Invalid user"));

        req.currentUser = {
            id: user.id,
            name: user.name,
            role: user.role,
        }

        return next();
    }catch(error) {
        return next(error);
    }
}

export function authorize(...roles: Role[]){
    return (req: Request, _res: Response, next: NextFunction) => {
        if(!req.currentUser) return next(unauthorized());
        if(!roles.includes(req.currentUser.role)) return next(forbidden());

        return next();
    }
}
