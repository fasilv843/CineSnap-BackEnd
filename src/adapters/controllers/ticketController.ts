import { Request, Response } from "express";
import { ITicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";
import { ID } from "../../interfaces/common";

export class TicketController {
    constructor (
        private readonly ticketUseCase: TicketUseCase
    ) {}

    async bookTicket (req: Request, res: Response) {
        const ticketReqs: ITicketReqs = req.body.ticketReqs
        console.log(ticketReqs, 'ticketReqs from controller');
        
        const apiRes = await this.ticketUseCase.bookTicketDataTemporarily (ticketReqs)
        res.status(apiRes.status).json(apiRes)
    }

    async getHoldedSeats (req: Request, res: Response) { 
        const showId = req.params.showId as unknown as ID
        console.log('getting holded seats with showid', showId);
        const apiRes = await this.ticketUseCase.getHoldedSeats(showId)
        res.status(apiRes.status).json(apiRes)
    }
}

