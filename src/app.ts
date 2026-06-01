import express from 'express';

export function createApp() {
    const app = express();

    app.use(express.json());

    app.get('/health', (_req, res) => {
        return res.status(200).json({
            message: "OK",
        });
    });

    return app;
}

const app = createApp();

export default app;