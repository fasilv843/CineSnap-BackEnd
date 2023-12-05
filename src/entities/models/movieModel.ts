import mongoose, { Model, Schema } from "mongoose";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { GENRES } from "../../constants/genreIds";
import { Languages } from "../../constants/langAbbreviation";
import { reviewSchema } from "./subSchema/reviewSchema";



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
    backdrop_path: {
        type: String
    },
    overview: {
        type: String,
        default: 'Overview not available',
        required: true
    },
    language: {
        type: String,
        index: true,
        required: true,
        enum: Object.values(Languages)
    },
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    duration: {
        hours: {
            type: Number,
            min: 1,
            max: 5,
            default: 2,
            required: true
        },
        minutes: {
            type: Number,
            min: 0,
            max: 59,
            default: 30,
            required: true
        }
    },
    release_date:{
        type: Date,
        // required: true
    },
    genre_ids: {
        type: [Number],
        default: [],
        enum: Object.values(GENRES),
        index: true
    },
    review: [reviewSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
})

movieSchema.index({ language: 1 });
movieSchema.index({ genre_ids: 1 });
movieSchema.index({ title: 'text' }, { default_language: 'en', language_override: 'en' });


export const movieModel: Model< IMovie & Document> = mongoose.model<IMovie & Document>('Movies', movieSchema)


// // Search for movies with a specific title
// const moviesWithTitle = await movieModel.find({ $text: { $search: 'yourTitle' } });

// // Search for movies in a specific language
// const moviesInLanguage = await movieModel.find({ $text: { $search: 'en' } }).where({ language: 'en' });
