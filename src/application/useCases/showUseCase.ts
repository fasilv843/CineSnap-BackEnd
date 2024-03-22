import { log } from "console";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { isPast, isToday } from "../../infrastructure/helperFunctions/date";
import { getEndingTime } from "../../infrastructure/helperFunctions/getMovieEnding";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { IApiShowRes, IApiShowsRes, IShowRequirements, IShowToSave } from "../interfaces/types/show";
import { createEmptyShowSeat } from "../../infrastructure/helperFunctions/showSeat";
import { IShowRepo } from "../interfaces/repos/showRepo";
import { IMovieRepo } from "../interfaces/repos/movieRepo";
import { IScreenRepo } from "../interfaces/repos/screenRepo";
import { IScreenSeatRepo } from "../interfaces/repos/screenSeatRepo";
import { IShowSeatRepo } from "../interfaces/repos/showSeatRepo";

export class ShowUseCase {
    constructor (
        private readonly _showRepository: IShowRepo,
        private readonly _movieRepository: IMovieRepo,
        private readonly _screenRepository: IScreenRepo,
        private readonly _screenSeatRepository: IScreenSeatRepo,
        private readonly _showSeatRepository: IShowSeatRepo,
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
                const shows = await this._showRepository.findShowsOnDate(theaterId, from, to)
                return get200Response(shows)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async addShow(show: IShowRequirements): Promise<IApiShowRes> {
        try {
            if (!show.movieId || !show.screenId || !show.startTime) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing')
            }

            const movie = await this._movieRepository.findMovieById(show.movieId)
            if (movie !== null) {
                const endingTime = getEndingTime(show.startTime, movie.duration)
                const collidedShows = await this._showRepository.getCollidingShowsOnTheScreen(show.screenId, show.startTime, endingTime)
                if (collidedShows.length === 0) {
                    const screen = await this._screenRepository.findScreenById(show.screenId)
                    if (screen) {
                        const screenSeat = await this._screenSeatRepository.findScreenSeatById(screen.seatId)
                        if (screenSeat) {
                            const showSeatToSave = createEmptyShowSeat(screenSeat)
                            const savedShowSeat = await this._showSeatRepository.saveShowSeat(showSeatToSave)
                            const showTosave: IShowToSave = {
                                movieId: movie._id,
                                screenId: screen._id,
                                startTime: new Date(show.startTime),
                                endTime: endingTime,
                                totalSeatCount: screen.seatsCount,
                                availableSeatCount: screen.seatsCount,
                                seatId: savedShowSeat._id
                            }
                            const savedShow = await this._showRepository.saveShow(showTosave)
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
                const show = await this._showRepository.getShowDetails(showId)
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