import { ticketModel } from "../../entities/models/ticketModel";
import { ITicketRepo } from "../../interfaces/repos/ticketRepo";
import { ITicketReqs, ITicketRes } from "../../interfaces/schema/ticketSchema";

export class TicketRepository implements ITicketRepo {
    async saveTicket (ticketData: ITicketReqs): Promise<ITicketRes> {
        console.log(ticketData, 'ticket data from saveTickt, not implimented');
        return await new ticketModel(ticketData).save()
    }
}