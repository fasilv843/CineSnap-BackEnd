import { QuarterRefundTime } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
// import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
// import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
// import { UserRepository } from "../infrastructure/repositories/userRepository";
import { ID } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITempTicketReqs, ITicketReqs } from "../interfaces/schema/ticketSchema";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository,
        // private readonly showRepository: ShowRepository,
        // private readonly theaterRepository: TheaterRepository,
        // private readonly userRepository: UserRepository,
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
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async confirmTicket (tempTicketId: ID): Promise<IApiTicketRes> {
        try {
            const tempTicket = await this.tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId)

            if (tempTicket !== null) {
                const tempTicketData = JSON.parse(JSON.stringify(tempTicket)) as ITicketReqs
                const confirmedTicket = await this.ticketRepository.saveTicket(tempTicketData)
                return get200Response(confirmedTicket)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfUser (userId: ID): Promise<IApiTicketsRes> {
        try {
            const ticketsOfUser = await this.ticketRepository.getTicketsByUserId(userId)
            return get200Response(ticketsOfUser)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfShow (showId: ID): Promise<IApiTicketsRes> {
        try {
            const ticketsOfShow = await this.ticketRepository.getTicketsByShowId(showId)
            return get200Response(ticketsOfShow)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelTicket (ticketId: ID): Promise<IApiTicketRes> {
        try {
            if (new Date() < QuarterRefundTime) 
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Cancellation only allowed 4 hr before show time')

            // const ticket = await this.ticketRepository.findTicketById(ticketId)
            // const ticketPrice = ticket?.singlePrice * 
            
            // if (ticket !== null) {
            //     this.theaterRepository.takeFromWallet(ticket?.totalPrice)
            // }

            const cancelledTicket = await this.ticketRepository.cancelTicket(ticketId)
            if (cancelledTicket) return get200Response(cancelledTicket)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
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