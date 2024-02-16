
export interface IReview {
    rating: number
    review?: string
    userId: string
}

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
