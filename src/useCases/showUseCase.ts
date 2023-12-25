import { log } from "console";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { isPast, isToday } from "../infrastructure/helperFunctions/date";
import { getEndingTime } from "../infrastructure/helperFunctions/getMovieEnding";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { ID } from "../interfaces/common";
import { IApiShowRes, IApiShowsRes, IShowRequirements } from "../interfaces/schema/showSchema";

export class ShowUseCase {
    constructor (
        private readonly showRepository: ShowRepository,
        private readonly movieRepository: MovieRepository,
    ) {}

    async findShowsOnTheater (theaterId: ID, dateStr: string | undefined, user: 'User' | 'Theater'): Promise<IApiShowsRes> {
        try {
            log(dateStr === undefined, isNaN(new Date(dateStr as string).getTime()), (user === 'User' && isPast(new Date(dateStr as string))))
            if (dateStr === undefined || isNaN(new Date(dateStr).getTime()) || (user === 'User' && isPast(new Date(dateStr)))) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Date is not available or invalid')
            }else {
                const date = new Date(dateStr)
                let from = new Date(date);
                from.setHours(0, 0, 0, 0);
                if (user === 'User' && isToday(from)) {
                    from = new Date()
                }
            
                const to = new Date(date);
                to.setHours(23, 59, 59, 999);
                // console.log(typeof date, 'type from usecase')
                const shows = await this.showRepository.findShowsOnDate(theaterId, from, to)
                return get200Response(shows)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // async findShowsOnTheaterByUser (theaterId: ID, dateStr: string | undefined): Promise<IApiShowsRes> {
    //     try {
    //         if (dateStr === undefined || isNaN(new Date(dateStr).getTime())) {
    //             return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Date is not available or invalid')
    //         }else {
    //             const date = new Date(dateStr)
    //             // console.log(typeof date, 'type from usecase')
    //             const shows = await this.showRepository.findShowsOnDateByUser(theaterId, date)
    //             return get200Response(shows)
    //         }
    //     } catch (error) {
    //         return get500Response(error as Error)
    //     }
    // }

    async addShow(show: IShowRequirements): Promise<IApiShowRes> {
        try {
            // console.log(show, 'show data from use case');
            // console.log(show.movieId, show.screenId, show.startTime);
            if (!show.movieId || !show.screenId || !show.startTime) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing')
            }

            const movie = await this.movieRepository.findMovieById(show.movieId)
            if (movie !== null) {
                const endingTime = getEndingTime(show.startTime, movie.duration)
                const collidedShows = await this.showRepository.getCollidingShowsOnTheScreen(show.screenId, show.startTime, endingTime)
                if (collidedShows.length === 0) {
                    const savedShow = await this.showRepository.saveShow(show)
                    return get200Response(savedShow)
                } else {
                    return getErrorResponse(STATUS_CODES.CONFLICT, 'Show already exists at the same time.')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getShowDetails (showId: ID | undefined): Promise<IApiShowRes> {
        try {
            if (showId) {
                const show = await this.showRepository.getShowDetails(showId)
                if (show !== null) return get200Response(show)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'showId is not availble')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // async editShow(showId: ID, show:IShowRequirements): Promise<IApiShowRes> {
    //     try {
    //         if (!show.movieId || !show.screenId || !show.startTime) {
    //             return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing')
    //         }
    //         const updatedShow = await this.showRepository.editShow(showId, show)
    //         return get200Response(updatedShow)
    //     } catch (error) {
    //         return get500Response(error as Error)
    //     }
    // }
}