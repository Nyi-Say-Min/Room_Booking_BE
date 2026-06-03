import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import bookingRouter from './routes/booking';
import userRouter from './routes/user';
import { errorHandler } from './middlewares/error_handler';

export function createApp() {
    const app = express();

    const allowedOrigins = process.env.CORS_ORIGIN
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    app.use(cors({
        origin: allowedOrigins?.length ? allowedOrigins : true,
    }));
    app.use(express.json({ limit: "100kb" }));

    app.get('/api/health', (_req, res) => {
        return res.status(200).json({
            message: "OK",
        });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/bookings', bookingRouter);
    app.use('/api/users', userRouter);

    app.use(errorHandler);

    return app;
}

const app = createApp();

export default app;
