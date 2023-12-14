import { ITempTicketRes, ITicketReqs } from "../schema/ticketSchema";

export interface ITempTicketRepo {
    saveTicketDataTemporarily (ticketData: ITicketReqs): Promise<ITempTicketRes>
}