import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { IMovie } from "../interfaces/schema/movieSchema";


export class MovieUseCase {
    constructor (
        private movieRepository: MovieRepository
    ) {}

    async saveMovie(movieData: IMovie){
        return await this.movieRepository.saveMovieDetails(movieData)
    }

    async findAllMovies(){
        return await this.movieRepository.findAllMovies()
    }

    async findMovieByTmdbId(id: number){
        return await this.movieRepository.findMovieByTmdbId(id)
    }

    async searchMovie(title: string){
        return await this.movieRepository.findMovieByTitle(title)
    }

    async findMovieByGenre(genreId: number){
        return await this.movieRepository.findMovieByGenre(genreId)
    }

    async findMoviesByLanguage(lang: string){
        return await this.movieRepository.findMovieByLanguage(lang)
    }

    async findMovieById(id: string){
        return await this.movieRepository.findMovieById(id)
    }

    async findUpcomingMovies(){
        return await this.movieRepository.findUpcomingMovies()
    }

    async deleteMovie(id: string){
        return await this.movieRepository.deleteMovie(id)
    }
}