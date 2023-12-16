import { ITempTicketRes, ITempTicketReqs } from "../schema/ticketSchema";

export interface ITempTicketRepo {
    saveTicketDataTemporarily (ticketData: ITempTicketReqs): Promise<ITempTicketRes>
}