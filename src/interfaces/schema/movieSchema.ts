import mongoose from "mongoose"

export interface IMovie {
    _id?: string
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    language: string
    tmdbId: number
    duration: IDuration
    release_date: Date
    genre_ids: number[]
    review?: IReview[]
    isDeleted?: boolean
}

export interface IReview {
    rating: number
    review?: string
    userId: mongoose.Schema.Types.ObjectId 
}

export interface IDuration {
    hours: number,
    minutes: number
}