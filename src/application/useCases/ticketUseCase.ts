import mongoose from "mongoose";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { IApiSeatsRes, IApiTempTicketRes, IApiTicketRes, IApiTicketsRes, ITempTicketReqs, ITempTicketRes, ITicketRes, ITicketsAndCount } from "../interfaces/types/ticket";
import { log } from "console";
import { ICouponRes } from "../interfaces/types/coupon";
import { IRevenueData } from "../interfaces/types/graphs";
import { getDateKeyWithInterval } from "../../infrastructure/helperFunctions/dashboardHelpers";
import { calculateAdminShare, calculateRefundShare, calculateTheaterShare } from "../../infrastructure/helperFunctions/calculateTheaterShare";
import { RefundNotAllowedError } from "../../infrastructure/errors/refundNotAllowedError";
import { CancelledByUnknownError } from "../../infrastructure/errors/cancelledByUnknownError";
import { CancelledBy, PaymentMethod } from "../../entities/common";
import { IShow } from "../../entities/show";
import { IApiRes } from "../interfaces/types/common";
import { IMailSender } from "../interfaces/utils/mailSender";
import { ITicketRepo } from "../interfaces/repos/ticketRepo";
import { ITempTicketRepo } from "../interfaces/repos/tempTicketRepo";
import { IShowRepo } from "../interfaces/repos/showRepo";
import { IShowSeatRepo } from "../interfaces/repos/showSeatRepo";
import { ITheaterRepo } from "../interfaces/repos/theaterRepo";
import { IUserRepo } from "../interfaces/repos/userRepo";
import { IAdminRepo } from "../interfaces/repos/adminRepo";
import { ICouponRepo } from "../interfaces/repos/couponRepo";

export class TicketUseCase {
    constructor(
        private readonly _ticketRepository: ITicketRepo,
        private readonly _tempTicketRepository: ITempTicketRepo,
        private readonly _showRepository: IShowRepo,
        private readonly _showSeatRepository: IShowSeatRepo,
        private readonly _theaterRepository: ITheaterRepo,
        private readonly _userRepository: IUserRepo,
        private readonly _adminRepository: IAdminRepo,
        private readonly _couponRepository: ICouponRepo,
        private readonly _mailSender: IMailSender
    ) { }

    async bookTicketDataTemporarily(ticketReqs: ITempTicketReqs): Promise<IApiTempTicketRes> {
        try {
            if (new Date(ticketReqs.startTime) < new Date()) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Show Already Started')
            log(ticketReqs, 'ticketReqs for tempTicket')
            const ticketData = await this._tempTicketRepository.saveTicketDataTemporarily(ticketReqs)
            if (ticketData !== null) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getHoldedSeats(showId: string): Promise<IApiSeatsRes> {
        try {
            const seats = await this._tempTicketRepository.getHoldedSeats(showId)
            log(seats, 'holded seats')
            return get200Response(seats)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTempTicketData(ticketId: string): Promise<IApiTempTicketRes> {
        try {
            const ticketData = await this._tempTicketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketData(ticketId: string): Promise<IApiTicketRes> {
        try {
            const ticketData = await this._ticketRepository.getTicketData(ticketId)
            if (ticketData) return get200Response(ticketData)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async confirmTicket(tempTicketId: string, paymentMethod: PaymentMethod, useWallet: boolean, couponId?: string): Promise<IApiTicketRes> {
        try {
            const tempTicket = await this._tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId)
            let couponData: ICouponRes | null = null
            if (couponId) couponData = await this._couponRepository.findCouponById(couponId)
            log(tempTicket, 'tempTicket from confirmTicket use case')
            if (tempTicket !== null) {
                const tempTicketData = JSON.parse(JSON.stringify(tempTicket)) as ITempTicketRes
                const show = await this._showRepository.getShowDetails(tempTicket.showId)
                if (show) {
                    await this._showSeatRepository.markAsBooked(show.seatId, tempTicketData.diamondSeats, tempTicketData.goldSeats, tempTicketData.silverSeats)

                    let confirmedTicket: ITicketRes
                    if (couponData) {
                        confirmedTicket = await this._ticketRepository.saveTicket({ ...tempTicketData, paymentMethod, couponId: couponData._id })
                    } else {
                        confirmedTicket = await this._ticketRepository.saveTicket({ ...tempTicketData, paymentMethod })
                    }

                    log(confirmedTicket, 'confirmedTicket')
                    if (paymentMethod === 'Wallet') {
                        await this._userRepository.updateWallet(confirmedTicket.userId, -confirmedTicket.totalPrice, 'Booked a show')
                    }
                    const user = await this._userRepository.findById(confirmedTicket.userId)
                    if (user) {
                        if (useWallet) {
                            await this._userRepository.updateWallet(confirmedTicket.userId, -user.wallet, 'For booking Ticket')
                        }
                    } else {
                        return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'userid invalid')
                    }
                    let theaterShare = calculateTheaterShare(confirmedTicket)
                    const adminShare = calculateAdminShare(confirmedTicket)

                    if (couponData) {
                        await this._userRepository.addToUsedCoupons(confirmedTicket.userId, couponData._id, confirmedTicket._id)
                        if (couponData.discountType === 'Fixed Amount') {
                            theaterShare -= couponData.discount
                        } else if (couponData.discountType === 'Percentage') {
                            theaterShare -= (theaterShare / 100) * couponData.discount
                        }
                    }
                    log(paymentMethod, 'paymentMethod')
                    await this._theaterRepository.updateWallet(tempTicket.theaterId, theaterShare, 'Profit from Ticket')
                    await this._adminRepository.updateWallet(adminShare, 'Fee for booking ticket')

                    const populatedTicket = await this._ticketRepository.getTicketData(confirmedTicket._id) as ITicketRes
                    await this._mailSender.sendBookingSuccessMail(user.email, populatedTicket)
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

    async getTicketsOfUser(userId: string): Promise<IApiTicketsRes> {
        try {
            const ticketsOfUser = await this._ticketRepository.getTicketsByUserId(userId)
            return get200Response(ticketsOfUser)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfShow(showId: string): Promise<IApiTicketsRes> {
        try {
            const ticketsOfShow = await this._ticketRepository.getTicketsByShowId(showId)
            return get200Response(ticketsOfShow)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelTicket(ticketId: string, cancelledBy: CancelledBy): Promise<IApiTicketRes> {
        try {
            const ticket = await this._ticketRepository.findTicketById(ticketId)
            if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Ticket id not available')

            const { refundByTheater, refundByAdmin } = calculateRefundShare(ticket, cancelledBy)
            const session = await mongoose.connection.startSession();

            try {
                let cancelledTicket: ITicketRes | null = null
                await session.withTransaction(async () => {

                    // taking refund amount from theater and giving it to user
                    await this._theaterRepository.updateWallet(ticket.theaterId, -refundByTheater, 'For Giving Refund for Ticket Cancellation')
                    await this._userRepository.updateWallet(ticket.userId, refundByTheater, 'Ticket Cancellation Refund')
                    if (cancelledBy === 'Admin') {
                        await this._adminRepository.updateWallet(-refundByAdmin, 'Ticket Cancellation Refund')
                        await this._userRepository.updateWallet(ticket.userId, refundByAdmin, 'Convenience Fee Refund')
                    }
                    // code to re assign cancelled ticket seat
                    cancelledTicket = await this._ticketRepository.cancelTicket(ticketId, cancelledBy)
                    if (cancelledTicket === null) throw Error('Something went wrong while canceling ticket')

                    const show = await this._showRepository.getShowDetails(cancelledTicket.showId) as IShow
                    await this._showSeatRepository.markAsNotBooked(show.seatId, cancelledTicket.diamondSeats, cancelledTicket.goldSeats, cancelledTicket.silverSeats)
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

    async sendInvoiceMail (ticketId: string): Promise<IApiTicketRes> {
        try {
            log(ticketId, 'ticket id')
            const ticket = await this._ticketRepository.getTicketData(ticketId)
            if (ticket) {
                const user = await this._userRepository.findById(ticket.userId)
                if (user) {
                    log('sending invoice to user ', user.email)
                    await this._mailSender.invoiceDownloadMail(user.email, ticket)
                    return get200Response(null)
                } else {
                    return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid user id in ticket')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid ticket id')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTicketsOfTheater(theaterId: string, page: number, limit: number): Promise<IApiRes<ITicketsAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            const tickets = await this._ticketRepository.getTicketsByTheaterId(theaterId, page, limit)
            const ticketCount = await this._ticketRepository.getTicketsByTheaterIdCount(theaterId)
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
            const tickets = await this._ticketRepository.getAllTickets(page, limit)
            const ticketCount = await this._ticketRepository.getAllTicketsCount()
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

            const tickets = await this._ticketRepository.findTicketsByTime(startDate, endDate)
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