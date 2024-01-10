import mongoose from "mongoose";
import { HalfRefundTime, NoRefundTime, QuarterRefundTime, ThreeQuarterRefundTime } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { calculateHoursDifference } from "../infrastructure/helperFunctions/date";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { IApiRes, ID } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITempTicketReqs, ITempTicketRes, ITicketRes, ITicketsAndCount } from "../interfaces/schema/ticketSchema";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { log } from "console";
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository";
import { ICouponRes } from "../interfaces/schema/couponSchema";
import { CouponRepository } from "../infrastructure/repositories/couponRepository";
import { IRevenueData } from "../interfaces/chart";
import { getDateKeyWithInterval } from "../infrastructure/helperFunctions/dashboardHelpers";
import { calculateAdminShare, calculateTheaterShare } from "../infrastructure/helperFunctions/calculateTheaterShare";

export class TicketUseCase {
    constructor (
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository,
        private readonly showRepository: ShowRepository,
        private readonly showSeatRepository: ShowSeatsRepository,
        private readonly theaterRepository: TheaterRepository,
        private readonly userRepository: UserRepository,
        private readonly adminRepository: AdminRepository,
        private readonly couponRepository: CouponRepository,

    ) {}

    async bookTicketDataTemporarily (ticketReqs: ITempTicketReqs): Promise<IApiTempTicketRes> {
        try {
            if (new Date(ticketReqs.startTime) < new Date()) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Show Already Started')
            log(ticketReqs, 'ticketReqs for tempTicket')
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
            log(seats, 'holded seats')
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

    async confirmTicket (tempTicketId: ID, couponId?: ID): Promise<IApiTicketRes> {
        try {
            const tempTicket = await this.tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId)
            let couponData: ICouponRes | undefined = undefined
            if (couponId) couponData = await this.couponRepository.findCouponById(couponId)
            log(tempTicket, 'tempTicket from confirmTicket use case')
            if (tempTicket !== null) {
                const tempTicketData = JSON.parse(JSON.stringify(tempTicket)) as ITempTicketRes
                const show = await this.showRepository.getShowDetails(tempTicket.showId)
                if (show){
                    await this.showSeatRepository.markAsBooked(show.seatId, tempTicketData.diamondSeats, tempTicketData.goldSeats, tempTicketData.silverSeats)
                    const confirmedTicket = await this.ticketRepository.saveTicket(tempTicketData)
                    let theaterShare = 0
                    let adminShare = 0
                    if (confirmedTicket.diamondSeats) {
                        theaterShare += confirmedTicket.diamondSeats.singlePrice * confirmedTicket.diamondSeats.seats.length
                        adminShare += confirmedTicket.diamondSeats.CSFeePerTicket * confirmedTicket.diamondSeats.seats.length
                    } 
                    if (confirmedTicket.goldSeats) {
                        theaterShare += confirmedTicket.goldSeats.singlePrice * confirmedTicket.goldSeats.seats.length
                        adminShare += confirmedTicket.goldSeats.CSFeePerTicket * confirmedTicket.goldSeats.seats.length
                    } 
                    if (confirmedTicket.silverSeats) {
                        theaterShare += confirmedTicket.silverSeats.singlePrice * confirmedTicket.silverSeats.seats.length
                        adminShare += confirmedTicket.silverSeats.CSFeePerTicket * confirmedTicket.silverSeats.seats.length
                    } 

                    if (couponData) {
                        if (couponData.discountType === 'Fixed Amount') {
                            theaterShare -= couponData.discount
                        } else if (couponData.discountType === 'Percentage') {
                            theaterShare -= (theaterShare / 100) * couponData.discount
                        }
                    }
                    await this.theaterRepository.updateWallet(tempTicket.theaterId, theaterShare, 'Booked a Ticket')
                    await this.adminRepository.updateWallet(adminShare, 'Fee for booking ticket')
                    return get200Response(confirmedTicket)
                } else {
                    return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid show id')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid temp ticket id, or ticket time out')
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

    async cancelTicketByTheater (ticketId: ID): Promise<IApiTicketRes> {
        try {
            const ticket = await this.ticketRepository.findTicketById(ticketId)
            if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Ticket id not available')

            const refundAmount = ticket.totalPrice
            const theaterData = await this.theaterRepository.findById(ticket.theaterId)

            if(theaterData && theaterData.wallet >= refundAmount) {
                const session = await mongoose.connection.startSession();
    
                try {
                    let cancelledTicket: ITicketRes | null = null
                    await session.withTransaction(async () => {
                        // taking refund amount from theater and giving it to user
                        await this.theaterRepository.updateWallet(ticket.theaterId, -refundAmount, 'For Giving Refund for Ticket Cancellation')
                        await this.userRepository.updateWallet(ticket.userId, refundAmount, 'Ticket Cancellation Refund')
                        // code to re assign cancelled ticket seat
                        cancelledTicket = await this.ticketRepository.cancelTicket(ticketId, 'Theater')
                    });
    
                    if (cancelledTicket === null) throw Error('Something went wrong while canceling ticket')
                
                    await session.commitTransaction();
                    return get200Response(cancelledTicket)
                  } catch (error) {
                      console.error('Error during cancelling ticket:', error)
                      await session.abortTransaction();
                      return getErrorResponse(STATUS_CODES.BAD_REQUEST)
                  } finally {
                    await session.endSession()
                  }

            } else {
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Dont have enough money in wallet')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelTicketByAdmin (ticketId: ID): Promise<IApiTicketRes> {
        try {
            const ticket = await this.ticketRepository.findTicketById(ticketId)
            if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Ticket id not available')

            const refundAmount = ticket.totalPrice

            const adminData = await this.adminRepository.findAdmin()

            if(adminData && adminData.wallet >= refundAmount) {
                const session = await mongoose.connection.startSession();
    
                try {
                    let cancelledTicket: ITicketRes | null = null
                    await session.withTransaction(async () => {
                        // taking refund amount from theater and giving it to user
                        await this.adminRepository.updateWallet(-refundAmount, 'For Giving Refund for Ticket Cancellation')
                        await this.userRepository.updateWallet(ticket.userId, refundAmount, 'Ticket Cancellation Refund')
                        // code to re assign cancelled ticket seat
                        cancelledTicket = await this.ticketRepository.cancelTicket(ticketId, 'Admin')
                    });
    
                    if (cancelledTicket === null) throw Error('Something went wrong while canceling ticket')
                
                    await session.commitTransaction();
                    return get200Response(cancelledTicket)
                  } catch (error) {
                      console.error('Error during cancelling ticket:', error);
                      await session.abortTransaction();
                      return getErrorResponse(STATUS_CODES.BAD_REQUEST)
                  } finally {
                    await session.endSession()
                  }
            } else {
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Dont have enough money in wallet')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfTheater (theaterId: ID, page: number, limit: number): Promise<IApiRes<ITicketsAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            const tickets = await this.ticketRepository.getTicketsByTheaterId(theaterId, page, limit)
            const ticketCount = await this.ticketRepository.getTicketsByTheaterIdCount(theaterId)
            log(ticketCount, 'ticketCount', tickets)
            return get200Response({tickets, ticketCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getAllTickets (page: number, limit: number): Promise<IApiRes<ITicketsAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            const tickets = await this.ticketRepository.getAllTickets(page, limit)
            const ticketCount = await this.ticketRepository.getAllTicketsCount()
            log(ticketCount, 'ticketCount', tickets)
            return get200Response({ tickets, ticketCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getAdminRevenue (startDate?: Date, endDate?: Date): Promise<IApiRes<IRevenueData | null>> {
        try {
            if (!startDate || !endDate) {
                startDate = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 1, // Go back one month
                  new Date().getDate() // Keep the same day of the month
                );
                endDate = new Date();
            }

            const tickets = await this.ticketRepository.findTicketsByTime(startDate, endDate)
            const addedAmt: Record<string, number> = {}
            tickets.forEach(tkt => {
                const dateKey = getDateKeyWithInterval(startDate as Date, endDate as Date, tkt.startTime)
                log(dateKey, 'dateKey from useCase')
                if (!addedAmt[dateKey]) {
                    addedAmt[dateKey] = 0;
                  }
                  addedAmt[dateKey] += calculateAdminShare(tkt)
            });
            const labels = Object.keys(addedAmt)
            const data = Object.values(addedAmt)
            return get200Response({ labels, data })
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}