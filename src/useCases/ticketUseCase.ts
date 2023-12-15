import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
import { ID } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, ITicketReqs } from "../interfaces/schema/ticketSchema";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository
    ) {}

    async bookTicketDataTemporarily (ticketReqs: ITicketReqs): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this.tempTicketRepository.saveTicketDataTemporarily(ticketReqs)
            if (ticketData !== null) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getHoldedSeats (showId: ID): Promise<IApiSeatsRes> {
        try {
            const seats = await this.tempTicketRepository.getHoldedSeats(showId)
            console.log(seats, typeof seats, 'seats data from holdedSeats');
            return get200Response(seats)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTempTicketData (ticketId: ID): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this.tempTicketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}