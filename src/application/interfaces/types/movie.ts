import { IMovie } from "../../../entities/movie"

export interface ITMDBMovie {
    tmdbId: number
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    language: string
    id: number
    release_date: Date
    genre_ids: number[]
}

export interface IApiCSMovieRes {
    status: number
    message: string
    data: IMovie | null
}

export interface IApiCSMoviesRes {
    status: number
    message: string
    data: IMovie[] | null
}

export interface IApiFilters {
    status: number
    message: string
    genres: number[]
    languages: string[]
}
