import { STATUS_CODES } from "../constants/httpStausCodes";
import { getLastRow, getSeatCount } from "../infrastructure/helperFunctions/getScreenSeat";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import { ID } from "../interfaces/common";
import { IApiScreenSeatRes, IScreenSeatRes } from "../interfaces/schema/screenSeatSchema";

export class ScreenSeatUseCase {
    constructor (
        private readonly screenSeatRepository: ScreenSeatRepository,
        private readonly screenRepository: ScreenRepository
    ) {}

    async findScreenSeatById (screenSeatId: ID): Promise<IApiScreenSeatRes> {
        try {
            const screenSeat = await this.screenSeatRepository.findScreenSeatById(screenSeatId)
            if (screenSeat) return get200Response(screenSeat)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Screen Id missing')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateScreenSeat (seatId: ID, seatData: IScreenSeatRes): Promise<IApiScreenSeatRes> {
        try {
            const seat = await this.screenSeatRepository.updateScreenSeat(seatData)
            if (seat){
                const seatCount = getSeatCount(seatData)
                const lastRow = getLastRow(seatData)
                const screen = await this.screenRepository.updateSeatCount(seat._id, seatCount, lastRow)
                if (screen) return get200Response(seat)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong')
            }
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'seatId is invalid')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // async deleteScreenSeat (seatId: ID): Promise<IApiScreenSeatRes> {
    //     try {
    //         const seat = await this.screenSeatRepository.deleteScreenSeat(seatId)
    //         if (seat) return get200Response(null)
    //         else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'seatId is invalid')
    //     } catch (error) {
    //         return get500Response(error as Error)
    //     }
    // }
}