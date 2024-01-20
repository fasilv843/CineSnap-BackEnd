"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const langAbbreviation_1 = require("../../constants/langAbbreviation");
const reviewSchema_1 = require("./subSchema/reviewSchema");
const movieSchema = new mongoose_1.Schema({
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
        enum: Object.values(langAbbreviation_1.Languages)
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
    release_date: {
        type: Date,
        // required: true
    },
    genre_ids: {
        type: [Number],
        default: [],
        index: true
    },
    review: [reviewSchema_1.reviewSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
});
movieSchema.index({ language: 1 });
movieSchema.index({ genre_ids: 1 });
movieSchema.index({ title: 'text' }, { default_language: 'en', language_override: 'en' });
exports.movieModel = mongoose_1.default.model('Movies', movieSchema);
// // Search for movies with a specific title
// const moviesWithTitle = await movieModel.find({ $text: { $search: 'yourTitle' } });
// // Search for movies in a specific language
// const moviesInLanguage = await movieModel.find({ $text: { $search: 'en' } }).where({ language: 'en' });
