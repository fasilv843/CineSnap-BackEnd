import { ITempTicketRes, ITempTicketReqs } from "../../interfaces/schema/ticketSchema";

export interface ITempTicketRepo {
    saveTicketDataTemporarily (ticketData: ITempTicketReqs): Promise<ITempTicketRes>
}