import { log } from "console";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { IApiCSMovieRes, IApiCSMoviesRes, IApiFilters, ITMDBMovie } from "../interfaces/types/movie";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { IMovieRepo } from "../interfaces/repos/movieRepo";


export class MovieUseCase {
    constructor (
        private readonly _movieRepository: IMovieRepo
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
            const movie =  await this._movieRepository.saveMovieDetails(movieData)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movie
            }
        } catch (error) {
            return get500Response(error as Error)
        }

    }

    async findMoviesLazily(page: number, genreFilters: number[], langFilters: string[], availability: string | undefined): Promise<IApiCSMoviesRes>{
        try {
            console.log(availability, 'availability from usecase')
            if (availability === undefined) availability = 'Available'
            const movies = await this._movieRepository.findMoviesLazily(page, genreFilters, langFilters, availability)
            return get200Response(movies)
        } catch (error) {
            log(error)
            return get500Response(error as Error)
        }
    }

    async searchMovie(title: string, isAdmin: boolean): Promise<IApiCSMoviesRes>{
        try {
            const movies = await this._movieRepository.findMovieByTitle(title, isAdmin)
            return get200Response(movies)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findMovieByGenre(genreId: number){
        return await this._movieRepository.findMovieByGenre(genreId)
    }

    async findMoviesByLanguage(lang: string){
        return await this._movieRepository.findMovieByLanguage(lang)
    }

    async findMovieById(movieId: string): Promise<IApiCSMovieRes> {
        try {
            const movie = await this._movieRepository.findMovieById(movieId)

            if (movie !== null) return get200Response(movie)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findUpcomingMovies(){
        return await this._movieRepository.findUpcomingMovies()
    }

    async deleteMovie(movieId: string): Promise<IApiCSMovieRes>{
        try {
            await this._movieRepository.deleteMovie(movieId)
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
            const movies = await this._movieRepository.findBannerMovies()
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
            const ids = await this._movieRepository.fetchTmdbMovieIds()
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
            const { languages, genres } = await this._movieRepository.getFilters()
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