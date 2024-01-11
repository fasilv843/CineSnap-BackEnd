import { Request, Response } from "express";
import { ITempTicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";
import { ID, PaymentMethod } from "../../interfaces/common";
// import Stripe from "stripe";
import { log } from "console";

export class TicketController {
    constructor (
        private readonly ticketUseCase: TicketUseCase
    ) {}

    async bookTicket (req: Request, res: Response) {
        const ticketReqs: ITempTicketReqs = req.body.ticketReqs
        const apiRes = await this.ticketUseCase.bookTicketDataTemporarily (ticketReqs)
        res.status(apiRes.status).json(apiRes)
    }

    async getHoldedSeats (req: Request, res: Response) { 
        const showId = req.params.showId as unknown as ID
        const apiRes = await this.ticketUseCase.getHoldedSeats(showId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketData (req: Request, res: Response) { 
        log('user router get ticket data is working')
        const ticketId = req.params.ticketId as unknown as ID
        const apiRes = await this.ticketUseCase.getTicketData(ticketId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTempTicketData (req: Request, res: Response) { 
        const ticketId = req.params.ticketId as unknown as ID
        const apiRes = await this.ticketUseCase.getTempTicketData(ticketId)
        res.status(apiRes.status).json(apiRes)
    }

    async confirmTicket (req: Request, res: Response) { 
        const tempTicketId = req.body.ticketId as unknown as ID
        const couponId = req.body.couponId as unknown as ID
        const paymentMethod = req.body.paymentMethod as PaymentMethod
        const useWallet = Boolean(req.body.useWallet)
        log(tempTicketId, 'tempId from controller')
        const apiRes = await this.ticketUseCase.confirmTicket(tempTicketId, paymentMethod, useWallet, couponId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfUser (req: Request, res: Response) { 
        const userId = req.params.userId as unknown as ID
        const apiRes = await this.ticketUseCase.getTicketsOfUser(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfShow (req: Request, res: Response) { 
        const showId = req.params.showId as unknown as ID
        const apiRes = await this.ticketUseCase.getTicketsOfShow(showId)
        res.status(apiRes.status).json(apiRes)
    }

    async cancelTicket (req: Request, res: Response) {
        const ticketId = req.params.ticketId as unknown as ID
        const apiRes = await this.ticketUseCase.cancelTicket(ticketId)
        log(apiRes, 'response of cancelled ticket')
        res.status(apiRes.status).json(apiRes)
    }

    async cancelTicketByTheater (req: Request, res: Response) {
        const ticketId = req.params.ticketId as unknown as ID
        const apiRes = await this.ticketUseCase.cancelTicketByTheater(ticketId)
        log(apiRes, 'response of cancelled ticket')
        res.status(apiRes.status).json(apiRes)
    }

    async cancelTicketByAdmin (req: Request, res: Response) {
        const ticketId = req.params.ticketId as unknown as ID
        const apiRes = await this.ticketUseCase.cancelTicketByAdmin(ticketId)
        log(apiRes, 'response of cancelled ticket')
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsOfTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)
        const apiRes = await this.ticketUseCase.getTicketsOfTheater(theaterId, page, limit)
        res.status(apiRes.status).json(apiRes)
    }

    async getAllTickets (req: Request, res: Response) {
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)
        const apiRes = await this.ticketUseCase.getAllTickets(page, limit)
        res.status(apiRes.status).json(apiRes)
    }
}

