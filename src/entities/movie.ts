import { IReview } from "./common"

export interface IDuration {
    hours: number,
    minutes: number
}

export interface IMovie {
    _id: string
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    duration: IDuration
    language: string
    tmdbId: number
    release_date: Date
    genre_ids: number[]
    review?: IReview[]
    isDeleted: boolean
}