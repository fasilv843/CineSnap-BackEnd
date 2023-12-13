import { TicketRepository } from "../infrastructure/repositories/ticketRepository";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository
    ) {}
}