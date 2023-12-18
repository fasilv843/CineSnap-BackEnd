import { Request, Response } from "express";
import { ITempTicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";
import { ID } from "../../interfaces/common";
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
        log(tempTicketId, 'tempId from controller')
        const apiRes = await this.ticketUseCase.confirmTicket(tempTicketId)
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

    // async payAndConfirmTicket (req: Request, res: Response) {
    //     const token = req.body.token
    //     console.log(token, 'token from pay and check')

    //     // this.ticketUseCase.bookTicket({priceId: req.body.priceId}, (response) => {
    //     //     return res.status(200).json(response)
    //     // })
    //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    //     log(stripe, 'stripe')
    //     stripe.customers.create({
    //         email: token.email,
    //         source: token.id
    //     }).then((customer) => {
    //         log(customer, 'customer from payAndConfirmTicket')
    //         return stripe.charges.create({
    //             amount: 10 * 100,
    //             description: 'Booking Ticket',
    //             currency: 'USD',
    //             customer: customer.id
    //         })
    //     }).then((charge) => {
    //         log(charge, 'charge from payAndConfirmTicket')
    //         res.status(200).json({ message: 'Success' })
    //     }).catch(err => {
    //         log(err, 'err in payment')
    //         res.status(500).json({ message: 'Payment failed' })
    //     })
    // }
}

