import { log } from "console";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { ID } from "../interfaces/common";
import { IApiCSMovieRes, IApiCSMoviesRes, IApiFilters, ITMDBMovie } from "../interfaces/schema/movieSchema";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";


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
            return get500Response(error as Error)
        }

    }

    // async findAllMovies(): Promise<IApiCSMoviesRes>{
    //     try {
    //         const movies = await this.movieRepository.findAllMovies()
    //         return {
    //             status: STATUS_CODES.OK,
    //             message: 'Success',
    //             data: movies
    //         }
    //     } catch (error) {
    //         return get500Response(error as Error)
    //     }
    // }

    async findMoviesLazily(page: number, genreFilters: number[], langFilters: string[], availability: string | undefined): Promise<IApiCSMoviesRes>{
        try {
            console.log(availability, 'availability from usecase')
            if (availability === undefined) availability = 'Available'
            const movies = await this.movieRepository.findMoviesLazily(page, genreFilters, langFilters, availability)
            return get200Response(movies)
        } catch (error) {
            log(error)
            return get500Response(error as Error)
        }
    }

    // async findMovieByTmdbId(id: number): Promise<IApiCSMovieRes>{
    //     return await this.movieRepository.findMovieByTmdbId(id)
    // }

    async searchMovie(title: string, isAdmin: boolean): Promise<IApiCSMoviesRes>{
        try {
            const movies = await this.movieRepository.findMovieByTitle(title, isAdmin)
            return get200Response(movies)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findMovieByGenre(genreId: number){
        return await this.movieRepository.findMovieByGenre(genreId)
    }

    async findMoviesByLanguage(lang: string){
        return await this.movieRepository.findMovieByLanguage(lang)
    }

    async findMovieById(movieId: ID): Promise<IApiCSMovieRes> {
        try {
            const movie = await this.movieRepository.findMovieById(movieId)

            if (movie !== null) return get200Response(movie)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findUpcomingMovies(){
        return await this.movieRepository.findUpcomingMovies()
    }

    async deleteMovie(movieId: ID): Promise<IApiCSMovieRes>{
        try {
            await this.movieRepository.deleteMovie(movieId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: null
            }
        } catch (error) {
            return get500Response(error as Error)
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
            return get500Response(error as Error)
        }
    }

    async getMovieIds (): Promise<{status: number, message: string, data: number[] | null}> {
        try {
            const ids = await this.movieRepository.fetchTmdbMovieIds()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: ids
            }
        } catch (error) {
            return get500Response(error as Error)
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