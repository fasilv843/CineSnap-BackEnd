import { Request, Response } from "express";
import { MovieUseCase } from "../../useCases/movieUseCase";



export class MovieController { 
    constructor (
        private movieUseCase: MovieUseCase
    ) {}

    async loadMovies(req: Request, res: Response){
        try {
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
            await this.movieUseCase.saveMovie(movie)
            res.status(200).json({message: 'Success'})
        } catch (error) {
            const err: Error = error as Error
            res.status(400).json({message: err.message})
        }
    }

    async deleteMovie(req: Request, res: Response){
        try {
            const { id } = req.params
            await this.movieUseCase.deleteMovie(id)
            res.status(200).json({message: 'Success'})
        } catch (error) {
            const err: Error = error as Error
            res.status(400).json({message: err.message})
        }
    }
}