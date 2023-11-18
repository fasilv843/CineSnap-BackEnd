import mongoose from "mongoose";
import { movieModel } from "../../entities/models/movieModel";
import { theaterModel } from "../../entities/models/theaterModel";


export const mongoConnect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (MONGO_URI) {
            await mongoose.connect(MONGO_URI);
            await movieModel.createIndexes();
            await theaterModel.createIndexes();
            console.log(`MongoDB connected: ${mongoose.connection.host}`);
        }
    } catch (error) {
        const err: Error = error as Error;
        console.log(`Error is ${err.message}`);
        process.exit(1);
    }
}

// const initializeIndexes = async () => {
//     try {
//         const moviesCollection: Collection = mongoose.connection.collection('movies');


//         // Create a text index on the title and description fields
//         await moviesCollection.createIndex(
//             { title: 'text', overview: 'text' },
//             { weights: { title: 3, overview: 1 }, default_language: 'english' }
//         );

//         console.log('Indexes initialized successfully');
//     } catch (error) {
//         const err: Error = error as Error;
//         console.log(`Error initializing indexes: ${err.message}`);
//     }
// }