import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { ID } from "../interfaces/common";
import { IApiShowRes, IApiShowsRes, IShowRequirements } from "../interfaces/schema/showSchema";

export class ShowUseCase {
    constructor (
        private showRepository: ShowRepository
    ) {}

    async findShowsOnTheater (theaterId: ID, dateStr: string | undefined): Promise<IApiShowsRes> {
        try {
            if (dateStr === undefined || isNaN(new Date(dateStr).getTime())) {
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Date is not available or invalid',
                    data: []
                }
            }else {
                const date = new Date(dateStr)
                console.log(typeof date, 'type from usecase')
                const shows = await this.showRepository.findShowsOnDate(theaterId, date)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: shows
                }
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async addShow(show: IShowRequirements): Promise<IApiShowRes> {
        try {
            console.log(show, 'show data from use case');
            console.log(show.movieId, show.screenId, show.startTime);
            if (!show.movieId || !show.screenId || !show.startTime) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing')
            }
            const savedShow = await this.showRepository.saveShow(show)
            return get200Response(savedShow)
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