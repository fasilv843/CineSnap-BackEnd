import mongoose, { Model, Schema } from "mongoose";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { GENRES } from "../../constants/genreIds";
import { Languages } from "../../constants/langAbbreviation";



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
        index: true,
        required: true,
        enum: Object.values(Languages)
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
        default: [],
        enum: Object.values(GENRES),
        index: true
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

movieSchema.index({ language: 1 });
movieSchema.index({ genre_ids: 1 });
movieSchema.index({ title: 'text' }, { default_language: 'en', language_override: 'en' });


export const movieModel: Model< IMovie & Document> = mongoose.model<IMovie & Document>('Movies', movieSchema)


// // Search for movies with a specific title
// const moviesWithTitle = await movieModel.find({ $text: { $search: 'yourTitle' } });

// // Search for movies in a specific language
// const moviesInLanguage = await movieModel.find({ $text: { $search: 'en' } }).where({ language: 'en' });
