import { ITempTicketRes, ITempTicketReqs, Seats } from "../../interfaces/schema/ticketSchema";

export interface ITempTicketRepo {
    saveTicketDataTemporarily (ticketData: ITempTicketReqs): Promise<ITempTicketRes>
    getTicketData (ticketId: string): Promise<ITempTicketRes | null>
    findTempTicketById (ticketId: string): Promise<ITempTicketRes | null>
    getTicketDataWithoutPopulate (ticketId: string): Promise<ITempTicketRes | null>
    getHoldedSeats (showId: string): Promise<Seats>
}