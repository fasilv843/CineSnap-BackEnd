import { log } from "console";
import { STATUS_CODES } from "../infrastructure/constants/httpStausCodes";
import { isPast, isToday } from "../infrastructure/helperFunctions/date";
import { getEndingTime } from "../infrastructure/helperFunctions/getMovieEnding";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { IApiShowRes, IApiShowsRes, IShowRequirements, IShowToSave } from "../interfaces/schema/showSchema";
import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository";
import { createEmptyShowSeat } from "../infrastructure/helperFunctions/showSeat";

export class ShowUseCase {
    constructor (
        private readonly showRepository: ShowRepository,
        private readonly movieRepository: MovieRepository,
        private readonly screenRepository: ScreenRepository,
        private readonly screenSeatRepository: ScreenSeatRepository,
        private readonly showSeatRepository: ShowSeatsRepository,
    ) {}

    async findShowsOnTheater (theaterId: string, dateStr: string | undefined, user: 'User' | 'Theater'): Promise<IApiShowsRes> {
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
                    const screen = await this.screenRepository.findScreenById(show.screenId)
                    if (screen) {
                        const screenSeat = await this.screenSeatRepository.findScreenSeatById(screen.seatId)
                        if (screenSeat) {
                            const showSeatToSave = createEmptyShowSeat(screenSeat)
                            const savedShowSeat = await this.showSeatRepository.saveShowSeat(showSeatToSave)
                            const showTosave: IShowToSave = {
                                movieId: movie._id,
                                screenId: screen._id,
                                startTime: new Date(show.startTime),
                                endTime: endingTime,
                                totalSeatCount: screen.seatsCount,
                                availableSeatCount: screen.seatsCount,
                                seatId: savedShowSeat._id
                            }
                            const savedShow = await this.showRepository.saveShow(showTosave)
                            return get200Response(savedShow)
                        } else {
                            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing')
                        }
                    } else {
                        return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing')
                    }
                } else {
                    return getErrorResponse(STATUS_CODES.CONFLICT, 'Show already exists at the same time.')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid movie id')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getShowDetails (showId: string): Promise<IApiShowRes> {
        try {
            if (showId) {
                const show = await this.showRepository.getShowDetails(showId)
                if (show !== null) return get200Response(show)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Show does not exist on requested Id')
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'showId is not availble')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}