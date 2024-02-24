import { log } from "console";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { IApiRes } from "../interfaces/types/common";
import { IShowSeatsRes } from "../interfaces/types/showSeats";
import { IShowSeatRepo } from "../interfaces/repos/showSeatRepo";

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