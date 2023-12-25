import mongoose from "mongoose";
import { HalfRefundTime, NoRefundTime, QuarterRefundTime, ThreeQuarterRefundTime } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { calculateHoursDifference } from "../infrastructure/helperFunctions/timeDifference";
// import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { ID } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITempTicketReqs, ITicketReqs, ITicketRes } from "../interfaces/schema/ticketSchema";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository,
        // private readonly showRepository: ShowRepository,
        private readonly theaterRepository: TheaterRepository,
        private readonly userRepository: UserRepository,
        private readonly adminRepository: AdminRepository
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
                const theaterShare = tempTicket.singlePrice * tempTicket.seatCount
                const adminShare = tempTicket.singlePrice * tempTicket.feePerTicket
                await this.theaterRepository.updateWallet(tempTicket.theaterId, theaterShare, 'Booked a Ticket')
                await this.adminRepository.updateWallet(adminShare, 'Fee for booking ticket')
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
            const ticket = await this.ticketRepository.findTicketById(ticketId)
            if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Ticket id not available')

            const hourDiff = calculateHoursDifference(ticket.startTime)

            // Calculationg refund amount based on hours difference
            if (hourDiff <= NoRefundTime) return getErrorResponse(STATUS_CODES.FORBIDDEN, `Cancellation only allowed ${NoRefundTime} hr before show time`)
            const totalPrice = ticket.singlePrice * ticket.seatCount // Excluding convenience fee and tax
            let refundAmount: number;
            if (hourDiff <= QuarterRefundTime) refundAmount = (totalPrice * 25)/100
            else if (hourDiff <= HalfRefundTime) refundAmount = (totalPrice * 50)/100
            else if (hourDiff <= ThreeQuarterRefundTime) refundAmount = (totalPrice * 75)/100
            else refundAmount = totalPrice
        

            const session = await mongoose.connection.startSession();

            try {
                let cancelledTicket: ITicketRes | null = null
                await session.withTransaction(async () => {
                    // taking refund amount from theater and giving it to user
                    await this.theaterRepository.updateWallet(ticket.theaterId, -refundAmount, 'For Giving Refund for Ticket Cancellation')
                    await this.userRepository.updateWallet(ticket.userId, refundAmount, 'Ticket Cancellation Refund')
                    // code to re assign cancelled ticket seat
                    cancelledTicket = await this.ticketRepository.cancelTicket(ticketId)
                });

                if (cancelledTicket === null) throw Error('Something went wrong while canceling ticket')
            
                await session.commitTransaction();
                console.log('Ticket cancelled successfully!');
                return get200Response(cancelledTicket)
              } catch (error) {
                  console.error('Error during cancelling ticket:', error);
                  await session.abortTransaction();
                  return getErrorResponse(STATUS_CODES.BAD_REQUEST)
              } finally {
                await session.endSession()
              }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}