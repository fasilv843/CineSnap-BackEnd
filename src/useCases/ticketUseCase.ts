import mongoose from "mongoose";
// import { HalfRefundTime, NoRefundTime, QuarterRefundTime, ThreeQuarterRefundTime } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
// import { calculateHoursDifference } from "../infrastructure/helperFunctions/date";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { TicketRepository } from "../infrastructure/repositories/ticketRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { CancelledBy, ColType, IApiRes, ID, PaymentMethod, RowType } from "../interfaces/common";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITempTicketReqs, ITempTicketRes, ITicketRes, ITicketsAndCount } from "../interfaces/schema/ticketSchema";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { log } from "console";
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository";
import { ICouponRes } from "../interfaces/schema/couponSchema";
import { CouponRepository } from "../infrastructure/repositories/couponRepository";
import { IRevenueData } from "../interfaces/chart";
import { getDateKeyWithInterval } from "../infrastructure/helperFunctions/dashboardHelpers";
import { calculateAdminShare, calculateRefundShare, calculateTheaterShare } from "../infrastructure/helperFunctions/calculateTheaterShare";
import { RefundNotAllowedError } from "../infrastructure/errors/refundNotAllowedError";
import { CancelledByUnknownError } from "../infrastructure/errors/cancelledByUnknownError";
import { IShow, IShowRes, IShowSingleSeat } from "../interfaces/schema/showSchema";

export class TicketUseCase {
    constructor(
        private readonly ticketRepository: TicketRepository,
        private readonly tempTicketRepository: TempTicketRepository,
        private readonly showRepository: ShowRepository,
        private readonly showSeatRepository: ShowSeatsRepository,
        private readonly theaterRepository: TheaterRepository,
        private readonly userRepository: UserRepository,
        private readonly adminRepository: AdminRepository,
        private readonly couponRepository: CouponRepository,

    ) { }

    async bookTicketDataTemporarily(ticketReqs: ITempTicketReqs): Promise<IApiTempTicketRes> {
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

    async getHoldedSeats(showId: ID): Promise<IApiSeatsRes> {
        try {
            const seats = await this.tempTicketRepository.getHoldedSeats(showId)
            log(seats, 'holded seats')
            return get200Response(seats)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTempTicketData(ticketId: ID): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this.tempTicketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketData(ticketId: ID): Promise<IApiTicketRes> {
        try {
            const ticketData = await this.ticketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async confirmTicket(tempTicketId: ID, paymentMethod: PaymentMethod, useWallet: boolean, couponId?: ID): Promise<IApiTicketRes> {
        try {
            const tempTicket = await this.tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId)
            let couponData: ICouponRes | null = null
            if (couponId) couponData = await this.couponRepository.findCouponById(couponId)
            log(tempTicket, 'tempTicket from confirmTicket use case')
            if (tempTicket !== null) {
                const tempTicketData = JSON.parse(JSON.stringify(tempTicket)) as ITempTicketRes
                const show = await this.showRepository.getShowDetails(tempTicket.showId)
                if (show) {
                    await this.showSeatRepository.markAsBooked(show.seatId, tempTicketData.diamondSeats, tempTicketData.goldSeats, tempTicketData.silverSeats)

                    let confirmedTicket: ITicketRes
                    if (couponData) {
                        confirmedTicket = await this.ticketRepository.saveTicket({ ...tempTicketData, paymentMethod, couponId: couponData._id })
                    } else {
                        confirmedTicket = await this.ticketRepository.saveTicket({ ...tempTicketData, paymentMethod })
                    }

                    log(confirmedTicket, 'confirmedTicket')
                    if (paymentMethod === 'Wallet') {
                        await this.userRepository.updateWallet(confirmedTicket.userId, -confirmedTicket.totalPrice, 'Booked a show')
                    }
                    if (useWallet) {
                        const user = await this.userRepository.findById(confirmedTicket.userId)
                        if (user) {
                            await this.userRepository.updateWallet(confirmedTicket.userId, -user.wallet, 'For booking Ticket')
                        }
                    }
                    let theaterShare = calculateTheaterShare(confirmedTicket)
                    const adminShare = calculateAdminShare(confirmedTicket)

                    if (couponData) {
                        await this.userRepository.addToUsedCoupons(confirmedTicket.userId, couponData._id, confirmedTicket._id)
                        if (couponData.discountType === 'Fixed Amount') {
                            theaterShare -= couponData.discount
                        } else if (couponData.discountType === 'Percentage') {
                            theaterShare -= (theaterShare / 100) * couponData.discount
                        }
                    }
                    log(paymentMethod, 'paymentMethod')
                    await this.theaterRepository.updateWallet(tempTicket.theaterId, theaterShare, 'Profit from Ticket')
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

    async getTicketsOfUser(userId: ID): Promise<IApiTicketsRes> {
        try {
            const ticketsOfUser = await this.ticketRepository.getTicketsByUserId(userId)
            return get200Response(ticketsOfUser)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfShow(showId: ID): Promise<IApiTicketsRes> {
        try {
            const ticketsOfShow = await this.ticketRepository.getTicketsByShowId(showId)
            return get200Response(ticketsOfShow)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelTicket(ticketId: ID, cancelledBy: CancelledBy): Promise<IApiTicketRes> {
        try {
            const ticket = await this.ticketRepository.findTicketById(ticketId)
            if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Ticket id not available')

            const { refundByTheater, refundByAdmin } = calculateRefundShare(ticket, cancelledBy)
            const session = await mongoose.connection.startSession();

            try {
                let cancelledTicket: ITicketRes | null = null
                await session.withTransaction(async () => {

                    // taking refund amount from theater and giving it to user
                    await this.theaterRepository.updateWallet(ticket.theaterId, -refundByTheater, 'For Giving Refund for Ticket Cancellation')
                    await this.userRepository.updateWallet(ticket.userId, refundByTheater, 'Ticket Cancellation Refund')
                    if (cancelledBy === 'Admin') {
                        await this.adminRepository.updateWallet(-refundByAdmin, 'Ticket Cancellation Refund')
                        await this.userRepository.updateWallet(ticket.userId, refundByAdmin, 'Convenience Fee Refund')
                    }
                    // code to re assign cancelled ticket seat
                    cancelledTicket = await this.ticketRepository.cancelTicket(ticketId, cancelledBy)
                    if (cancelledTicket === null) throw Error('Something went wrong while canceling ticket')

                    const show = await this.showRepository.getShowDetails(cancelledTicket.showId) as IShow
                    await this.showSeatRepository.markAsNotBooked(show.seatId, cancelledTicket.diamondSeats, cancelledTicket.goldSeats, cancelledTicket.silverSeats)
                });

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
            if (error instanceof RefundNotAllowedError || error instanceof CancelledByUnknownError) {
                return getErrorResponse(error.statusCode, error.message)
            }
            return get500Response(error as Error)
        }
    }

    async getTicketsOfTheater(theaterId: ID, page: number, limit: number): Promise<IApiRes<ITicketsAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            const tickets = await this.ticketRepository.getTicketsByTheaterId(theaterId, page, limit)
            const ticketCount = await this.ticketRepository.getTicketsByTheaterIdCount(theaterId)
            log(ticketCount, 'ticketCount', tickets)
            return get200Response({ tickets, ticketCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getAllTickets(page: number, limit: number): Promise<IApiRes<ITicketsAndCount | null>> {
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

    async getAdminRevenue(startDate?: Date, endDate?: Date): Promise<IApiRes<IRevenueData | null>> {
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