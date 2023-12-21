import { log } from "console";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { ID } from "../interfaces/common";
import { IApiCSMovieRes, IApiCSMoviesRes, IApiFilters, ITMDBMovie } from "../interfaces/schema/movieSchema";


export class MovieUseCase {
    constructor (
        private readonly movieRepository: MovieRepository
    ) {}

    async saveMovie(movieData: ITMDBMovie): Promise<IApiCSMovieRes>{
        try {
            if(movieData === undefined) {
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Movie data did\'t recieved',
                    data: null
                }
            }
            const movie =  await this.movieRepository.saveMovieDetails(movieData)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movie
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }

    }

    async findAllMovies(): Promise<IApiCSMoviesRes>{
        try {
            const movies = await this.movieRepository.findAllMovies()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movies
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async findAvailableMovies(page: number, genreFilters: number[], langFilters: string[], availability: string | undefined): Promise<IApiCSMoviesRes>{
        try {
            if (availability !== undefined) availability = 'Available'
            const movies = await this.movieRepository.findAvailableMoviesLazy(page, genreFilters, langFilters, availability)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movies
            }
        } catch (error) {
            log(error)
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    // async findMovieByTmdbId(id: number): Promise<IApiCSMovieRes>{
    //     return await this.movieRepository.findMovieByTmdbId(id)
    // }

    async searchMovie(title: string): Promise<IApiCSMoviesRes>{
        try {
            const movies = await this.movieRepository.findMovieByTitle(title)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movies
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async findMovieByGenre(genreId: number){
        return await this.movieRepository.findMovieByGenre(genreId)
    }

    async findMoviesByLanguage(lang: string){
        return await this.movieRepository.findMovieByLanguage(lang)
    }

    async findMovieById(id: ID){
        return await this.movieRepository.findMovieById(id)
    }

    async findUpcomingMovies(){
        return await this.movieRepository.findUpcomingMovies()
    }

    async deleteMovie(id: ID): Promise<IApiCSMovieRes>{
        try {
            await this.movieRepository.deleteMovie(id)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: null
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }
    }

    async getBannerMovies (): Promise<IApiCSMoviesRes> {
        try {
            const movies = await this.movieRepository.findBannerMovies()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movies
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async getMovieIds (): Promise<{status: number, message: string, data: number[]}> {
        try {
            const ids = await this.movieRepository.fetchTmdbMovieIds()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: ids
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async getFilters (): Promise<IApiFilters> {
        try {
            const { languages, genres } = await this.movieRepository.getFilters()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                genres,
                languages 
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                genres: [],
                languages: []
            }
        }
    }
}