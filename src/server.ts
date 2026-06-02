import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';
import { makeDb } from './db';

dotenv.config();

const PORT = process.env.PORT || 3000;
makeDb();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
    if(isShuttingDown){
        return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}. Shutting down gracefully...`);

    server.close(async() => {
        try{
            await mongoose.disconnect();

            process.exit(0);
        }catch(error) {
            console.error("Failed to shut down clearly.", error);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error("Forcing shutdown after timeout.");
        void mongoose.disconnect().finally(() => {
            process.exit(1);       
        })
    }).unref();
}

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});