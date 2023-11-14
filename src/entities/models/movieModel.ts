import mongoose, { Model, Schema } from "mongoose";
import { IMovie } from "../../interfaces/schema/movieSchema";



const movieSchema: Schema = new Schema<IMovie & Document>({
    title: {
        type: String,
        required: true
    },
    original_title: {
        type: String,
    },
    poster_path: {
        type: String,
        required: true
    },
    overview: {
        type: String
    },
    language: {
        type: String,
        required: true,
        enum: ['ml','ta','en','hi','en']
    },
    tmdbId: {
        type: Number,
        required: true
    },
    release_date:{
        type: Date,
        // required: true
    },
    genre_ids: {
        type: [Number],
        default: []
    },
    review: [{
        rating: {
            type: Number
        },
        review: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
})

export const movieModel: Model< IMovie & Document> = mongoose.model<IMovie & Document>('Movies', movieSchema)