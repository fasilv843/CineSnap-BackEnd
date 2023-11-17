
export interface IMovie {
    _id?: string
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    language: string
    tmdbId: number
    release_date: Date
    genre_ids: number[]
    review?: MovieReview[]
    isDeleted?: boolean
}

type MovieReview = {
    rating: number
    review: string
    userId: string
}