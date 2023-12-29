import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import { ID } from "../interfaces/common";
import { IApiScreenSeatRes } from "../interfaces/schema/screenSeatSchema";

export class ScreenSeatUseCase {
    constructor (
        private readonly screenSeatRepository: ScreenSeatRepository
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
}