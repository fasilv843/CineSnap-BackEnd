import { Request, Response } from "express";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { ITMDBMovie } from "../../interfaces/schema/movieSchema";
import { ID } from "../../interfaces/common";



export class MovieController {
    constructor(
        private movieUseCase: MovieUseCase
    ) { }

    async getMovies(req: Request, res: Response) {
        const title = req.query.title as string
        if (title) {
            const apiRes = await this.movieUseCase.searchMovie(title)
            return res.status(apiRes.status).json(apiRes)
        }
        const apiRes = await this.movieUseCase.findAllMovies()
        res.status(apiRes.status).json(apiRes)
    }

    async getBannerMovies(req: Request, res: Response) {
        const apiRes = await this.movieUseCase.getBannerMovies()
        res.status(apiRes.status).json(apiRes)
    }

    async getAvailableMovies(req: Request, res: Response) {
        const title = req.query.title as string
        if (title) {
            const apiRes = await this.movieUseCase.searchMovie(title)
            return res.status(apiRes.status).json(apiRes)
        }
        const apiRes = await this.movieUseCase.findAvailableMovies()
        res.status(apiRes.status).json(apiRes)
    }

    async addMovie(req: Request, res: Response) {
        const movie: ITMDBMovie = req.body
        console.log(movie, 'movie from controller');
        const apiRes = await this.movieUseCase.saveMovie(movie)
        res.status(apiRes.status).json(apiRes)
    }

    async deleteMovie(req: Request, res: Response) {
        const movieId: ID = req.params.movieId as unknown as ID
        const deleteRes = await this.movieUseCase.deleteMovie(movieId)
        res.status(deleteRes.status).json()
    }

    async getCineSnapMovieIds (req: Request, res: Response) {
        const apiRes = await this.movieUseCase.getMovieIds()
        res.status(apiRes.status).json(apiRes)
    }

    async getFilters (req: Request, res: Response) {
        const apiRes = await this.movieUseCase.getFilters()
        res.status(apiRes.status).json(apiRes)
    }
}