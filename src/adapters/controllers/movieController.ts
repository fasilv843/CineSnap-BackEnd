import { Request, Response } from "express";
import { MovieUseCase } from "../../useCases/movieUseCase";



export class MovieController { 
    constructor (
        private movieUseCase: MovieUseCase
    ) {}

    async getMovies(req: Request, res: Response){
        try {
            if(req.query.title){
                console.log(req.query.title);
                const movies = await this.movieUseCase.searchMovie(req.query.title as string) ///////
                return res.status(200).json({movies})
            }
            const movies = await this.movieUseCase.findAllMovies()
            res.status(200).json({movies})
        } catch (error) {
            const err: Error = error as Error
            res.status(400).json({message: err.message})
        }
    }

    async addMovie(req:Request, res: Response) {
        try {
            const { movie } = req.body
            if(movie === undefined) throw Error('Movie is undefined, req.body dont have movie')
            console.log(movie, 'movie from controller');
            const isMovieExist = await this.movieUseCase.findMovieByTmdbId(movie.tmdbId)
            if(isMovieExist !== null){
                throw Error('Movie already exist in database')
            }else{
                await this.movieUseCase.saveMovie(movie)
                res.status(200).json({message: 'Success'})
            }
        } catch (error) {
            const err: Error = error as Error
            res.status(400).json({message: err.message})
        }
    }

    async deleteMovie(req: Request, res: Response){
        try {
            const { movieId } = req.params
            await this.movieUseCase.deleteMovie(movieId)
            res.status(200).json({message: 'Success'})
        } catch (error) {
            const err: Error = error as Error
            res.status(400).json({message: err.message})
        }
    }
}