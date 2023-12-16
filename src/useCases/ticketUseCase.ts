import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
import { ID } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, ITempTicketReqs, ITicketReqs } from "../interfaces/schema/ticketSchema";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository
    ) {}

    async bookTicketDataTemporarily (ticketReqs: ITempTicketReqs): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this.tempTicketRepository.saveTicketDataTemporarily(ticketReqs)
            if (ticketData !== null) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getHoldedSeats (showId: ID): Promise<IApiSeatsRes> {
        try {
            const seats = await this.tempTicketRepository.getHoldedSeats(showId)
            // console.log(seats, typeof seats, 'seats data from holdedSeats');
            return get200Response(seats)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTempTicketData (ticketId: ID): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this.tempTicketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketData (ticketId: ID): Promise<IApiTicketRes> {
        try {
            const ticketData = await this.ticketRepository.getTicketData(ticketId)
            // log(ticketData, 'ticket data from api')
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async confirmTicket (tempTicketId: ID): Promise<IApiTicketRes> {
        try {
            // log(tempTicketId, 'temp ticket id from confirm ticket')
            const tempTicket = await this.tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId)
            // log(tempTicket, 'tempTicket from confirm ticket use case')
            if (tempTicket !== null) {
                const tempTicketData = JSON.parse(JSON.stringify(tempTicket)) as ITicketReqs
                const confirmedTicket = await this.ticketRepository.saveTicket(tempTicketData)
                // console.log(confirmedTicket.seats, 'seats that returned to front end')
                return get200Response(confirmedTicket)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // async bookTicket (params: any, callback: any) {
    //     const SECRET_KEY = STRIPE_CONFIG.SECRET_KEY as string
    //     const stripe = new Stripe(SECRET_KEY)
    //     const session = await stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         line_items: [{ price: params.priceId }],
    //         mode: 'payment',
    //         success_url: STRIPE_CONFIG.SUCCESS_URL,
    //         cancel_url: STRIPE_CONFIG.CANCEL_URL
    //     })

    //     callback({ id: session.id })
    // }
}