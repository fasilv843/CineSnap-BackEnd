import { Request, Response } from "express";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { ITMDBMovie } from "../../interfaces/schema/movieSchema";

export class MovieController {
    constructor(
        private readonly _movieUseCase: MovieUseCase
    ) { }

    async getMovieDetails (req: Request, res: Response) { 
        const movieId = req.params.movieId
        const apiRes = await this._movieUseCase.findMovieById(movieId)
        res.status(apiRes.status).json(apiRes)
    }

    // To get movies to show on user Home, focusing on latest released movies
    async getBannerMovies(req: Request, res: Response) {
        const apiRes = await this._movieUseCase.getBannerMovies()
        res.status(apiRes.status).json(apiRes)
    }

    // To get all non deleted movies from the database
    async getMovies(req: Request, res: Response) {
        const title = req.query.title as string
        const page = req.query.page as string | undefined
        const isAdmin = Boolean(req.query.isAdmin)

        const genreFilters: number[] = [];
        const langFilters: string[] = [];

        Object.keys(req.query).forEach((key) => {
            if (key.startsWith('g')) {
              genreFilters.push(parseInt(req.query[key] as string))
            } else if (key.startsWith('l')) {
              langFilters.push(req.query[key] as string)
            }
        });

        const availability = req.query.availability as string | undefined

        let pageNum = 1
        if(page) pageNum = parseInt(page)
        if (title) {
            const apiRes = await this._movieUseCase.searchMovie(title, isAdmin)
            return res.status(apiRes.status).json(apiRes)
        }
        const apiRes = await this._movieUseCase.findMoviesLazily(pageNum, genreFilters, langFilters, availability)
        res.status(apiRes.status).json(apiRes)
    }

    // To add a movie to CineSnap from TMDB
    async addMovie(req: Request, res: Response) {
        const movie: ITMDBMovie = req.body.movie
        console.log(movie, 'movie from controller');
        const apiRes = await this._movieUseCase.saveMovie(movie)
        res.status(apiRes.status).json(apiRes)
    }

    // To delete/hide a movie from users and theaters
    async deleteMovie(req: Request, res: Response) {
        const movieId = req.params.movieId
        const deleteRes = await this._movieUseCase.deleteMovie(movieId)
        res.status(deleteRes.status).json()
    }

    // to get tmdb ids of movies that stored in CineSnap - used only in admin side
    async getCineSnapMovieIds (req: Request, res: Response) {
        const apiRes = await this._movieUseCase.getMovieIds()
        res.status(apiRes.status).json(apiRes)
    }

    // To get the filter data, based on which data that we are filtering
    async getFilters (req: Request, res: Response) {
        const apiRes = await this._movieUseCase.getFilters()
        res.status(apiRes.status).json(apiRes)
    }
}