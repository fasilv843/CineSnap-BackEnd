import { Request, Response } from "express";
import { ITempTicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";
import { CancelledBy, PaymentMethod } from "../../entities/common";

export class TicketController {
    constructor (
        private readonly _ticketUseCase: TicketUseCase
    ) {}

    async bookTicket (req: Request, res: Response) {
        const ticketReqs: ITempTicketReqs = req.body.ticketReqs
        const apiRes = await this._ticketUseCase.bookTicketDataTemporarily (ticketReqs)
        res.status(apiRes.status).json(apiRes)
    }

    async getHoldedSeats (req: Request, res: Response) { 
        const showId = req.params.showId
        const apiRes = await this._ticketUseCase.getHoldedSeats(showId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketData (req: Request, res: Response) { 
        const ticketId = req.params.ticketId
        const apiRes = await this._ticketUseCase.getTicketData(ticketId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTempTicketData (req: Request, res: Response) { 
        const ticketId = req.params.ticketId
        const apiRes = await this._ticketUseCase.getTempTicketData(ticketId)
        res.status(apiRes.status).json(apiRes)
    }

    async confirmTicket (req: Request, res: Response) { 
        const tempTicketId = req.body.ticketId
        const couponId = req.body.couponId
        const paymentMethod = req.body.paymentMethod as PaymentMethod
        const useWallet = Boolean(req.body.useWallet)
        const apiRes = await this._ticketUseCase.confirmTicket(tempTicketId, paymentMethod, useWallet, couponId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfUser (req: Request, res: Response) { 
        const userId = req.params.userId
        const apiRes = await this._ticketUseCase.getTicketsOfUser(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfShow (req: Request, res: Response) { 
        const showId = req.params.showId
        const apiRes = await this._ticketUseCase.getTicketsOfShow(showId)
        res.status(apiRes.status).json(apiRes)
    }

    async cancelTicket (req: Request, res: Response) {
        const ticketId = req.params.ticketId
        const cancelledBy = req.body.cancelledBy as unknown as CancelledBy 
        const apiRes = await this._ticketUseCase.cancelTicket(ticketId, cancelledBy)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)
        const apiRes = await this._ticketUseCase.getTicketsOfTheater(theaterId, page, limit)
        res.status(apiRes.status).json(apiRes)
    }

    async getAllTickets (req: Request, res: Response) {
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)
        const apiRes = await this._ticketUseCase.getAllTickets(page, limit)
        res.status(apiRes.status).json(apiRes)
    }

    async sendInvoiceMail (req: Request, res: Response) {
        const ticketId = req.body.ticketId
        const apiRes = await this._ticketUseCase.sendInvoiceMail(ticketId)
        res.status(apiRes.status).json(apiRes)
    }
}

