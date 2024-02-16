import { log } from "console";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository";
import { IApiRes } from "../interfaces/common";
import { IShowSeatsRes } from "../interfaces/schema/showSeatsSchema";

export class ShowSeatsUseCase {
    constructor (
        private readonly showSeatRepository: ShowSeatsRepository
    ) {}
    
    async findShowSeatById (showSeatId: string): Promise<IApiRes<IShowSeatsRes | null>> {
        try {
            const showSeats = await this.showSeatRepository.findShowSeatById(showSeatId)
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