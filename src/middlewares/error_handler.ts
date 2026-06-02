import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app_error";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    if(error instanceof ZodError){
        return res.status(400).json({
            message: "Validation failed",
            errors: error.issues,
        });
    }

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
    }

    return res.status(500).json({
        message: "Internal server error",
    });
}