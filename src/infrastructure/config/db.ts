import mongoose from "mongoose";
import { movieModel } from "../../entities/models/movieModel";
import { theaterModel } from "../../entities/models/theaterModel";
import { tempUserModel } from "../../entities/models/temp/tempUserModel";


export const mongoConnect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (MONGO_URI) {
            await mongoose.connect(MONGO_URI);
            await movieModel.createIndexes();
            await theaterModel.createIndexes();
            await tempUserModel.createIndexes();
            console.log(`MongoDB connected: ${mongoose.connection.host}`);
        }
    } catch (error) {
        const err: Error = error as Error;
        console.log(`Error is ${err.message}`);
        process.exit(1);
    }
}
