import { log } from "console";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { IApiRes } from "../interfaces/common";
import { IShowSeatsRes } from "../interfaces/schema/showSeatsSchema";
import { IShowSeatRepo } from "./repos/showSeatRepo";

export class ShowSeatsUseCase {
    constructor (
        private readonly _showSeatRepository: IShowSeatRepo
    ) {}
    
    async findShowSeatById (showSeatId: string): Promise<IApiRes<IShowSeatsRes | null>> {
        try {
            const showSeats = await this._showSeatRepository.findShowSeatById(showSeatId)
            log(showSeatId, 'showSeatId')
            if (showSeats) {
                return get200Response(showSeats)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid show seat id')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}