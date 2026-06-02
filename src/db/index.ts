import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:" + err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
});

export async function makeDb(): Promise<mongoose.Connection> {
    if(!MONGO_URI){
        throw new Error("MONGO URI is missing");
    }
    if(mongoose.connection.readyState !== 1){
        await mongoose.connect(MONGO_URI);
    }
    return mongoose.connection;
}
