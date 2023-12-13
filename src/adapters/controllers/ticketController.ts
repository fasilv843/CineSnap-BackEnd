import { Request, Response } from "express";
import { ITicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";

export class TicketController {
    constructor (
        private readonly ticketUseCase: TicketUseCase
    ) {}

    // saveTicket (req: Request, res: Response) {
    //     const { ticketReqs } = req.body
    // }
}