"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUseCase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const response_1 = require("../../infrastructure/helperFunctions/response");
const console_1 = require("console");
const dashboardHelpers_1 = require("../../infrastructure/helperFunctions/dashboardHelpers");
const calculateTheaterShare_1 = require("../../infrastructure/helperFunctions/calculateTheaterShare");
const refundNotAllowedError_1 = require("../../infrastructure/errors/refundNotAllowedError");
const cancelledByUnknownError_1 = require("../../infrastructure/errors/cancelledByUnknownError");
class TicketUseCase {
    constructor(_ticketRepository, _tempTicketRepository, _showRepository, _showSeatRepository, _theaterRepository, _userRepository, _adminRepository, _couponRepository, _mailSender) {
        this._ticketRepository = _ticketRepository;
        this._tempTicketRepository = _tempTicketRepository;
        this._showRepository = _showRepository;
        this._showSeatRepository = _showSeatRepository;
        this._theaterRepository = _theaterRepository;
        this._userRepository = _userRepository;
        this._adminRepository = _adminRepository;
        this._couponRepository = _couponRepository;
        this._mailSender = _mailSender;
    }
    bookTicketDataTemporarily(ticketReqs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (new Date(ticketReqs.startTime) < new Date())
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Show Already Started');
                (0, console_1.log)(ticketReqs, 'ticketReqs for tempTicket');
                const ticketData = yield this._tempTicketRepository.saveTicketDataTemporarily(ticketReqs);
                if (ticketData !== null)
                    return (0, response_1.get200Response)(ticketData);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getHoldedSeats(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seats = yield this._tempTicketRepository.getHoldedSeats(showId);
                (0, console_1.log)(seats, 'holded seats');
                return (0, response_1.get200Response)(seats);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTempTicketData(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketData = yield this._tempTicketRepository.getTicketData(ticketId);
                if (ticketData)
                    return (0, response_1.get200Response)(ticketData);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTicketData(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketData = yield this._ticketRepository.getTicketData(ticketId);
                if (ticketData)
                    return (0, response_1.get200Response)(ticketData);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    confirmTicket(tempTicketId, paymentMethod, useWallet, couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tempTicket = yield this._tempTicketRepository.getTicketDataWithoutPopulate(tempTicketId);
                let couponData = null;
                if (couponId)
                    couponData = yield this._couponRepository.findCouponById(couponId);
                (0, console_1.log)(tempTicket, 'tempTicket from confirmTicket use case');
                if (tempTicket !== null) {
                    const tempTicketData = JSON.parse(JSON.stringify(tempTicket));
                    const show = yield this._showRepository.getShowDetails(tempTicket.showId);
                    if (show) {
                        yield this._showSeatRepository.markAsBooked(show.seatId, tempTicketData.diamondSeats, tempTicketData.goldSeats, tempTicketData.silverSeats);
                        let confirmedTicket;
                        if (couponData) {
                            confirmedTicket = yield this._ticketRepository.saveTicket(Object.assign(Object.assign({}, tempTicketData), { paymentMethod, couponId: couponData._id }));
                        }
                        else {
                            confirmedTicket = yield this._ticketRepository.saveTicket(Object.assign(Object.assign({}, tempTicketData), { paymentMethod }));
                        }
                        (0, console_1.log)(confirmedTicket, 'confirmedTicket');
                        if (paymentMethod === 'Wallet') {
                            yield this._userRepository.updateWallet(confirmedTicket.userId, -confirmedTicket.totalPrice, 'Booked a show');
                        }
                        const user = yield this._userRepository.findById(confirmedTicket.userId);
                        if (user) {
                            if (useWallet) {
                                yield this._userRepository.updateWallet(confirmedTicket.userId, -user.wallet, 'For booking Ticket');
                            }
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'userid invalid');
                        }
                        let theaterShare = (0, calculateTheaterShare_1.calculateTheaterShare)(confirmedTicket);
                        const adminShare = (0, calculateTheaterShare_1.calculateAdminShare)(confirmedTicket);
                        if (couponData) {
                            yield this._userRepository.addToUsedCoupons(confirmedTicket.userId, couponData._id, confirmedTicket._id);
                            if (couponData.discountType === 'Fixed Amount') {
                                theaterShare -= couponData.discount;
                            }
                            else if (couponData.discountType === 'Percentage') {
                                theaterShare -= (theaterShare / 100) * couponData.discount;
                            }
                        }
                        (0, console_1.log)(paymentMethod, 'paymentMethod');
                        yield this._theaterRepository.updateWallet(tempTicket.theaterId, theaterShare, 'Profit from Ticket');
                        yield this._adminRepository.updateWallet(adminShare, 'Fee for booking ticket');
                        const populatedTicket = yield this._ticketRepository.getTicketData(confirmedTicket._id);
                        yield this._mailSender.sendBookingSuccessMail(user.email, populatedTicket);
                        return (0, response_1.get200Response)(confirmedTicket);
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid show id');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid temp ticket id, or ticket time out');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTicketsOfUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketsOfUser = yield this._ticketRepository.getTicketsByUserId(userId);
                return (0, response_1.get200Response)(ticketsOfUser);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTicketsOfShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketsOfShow = yield this._ticketRepository.getTicketsByShowId(showId);
                return (0, response_1.get200Response)(ticketsOfShow);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    cancelTicket(ticketId, cancelledBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this._ticketRepository.findTicketById(ticketId);
                if (ticket === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Ticket id not available');
                const { refundByTheater, refundByAdmin } = (0, calculateTheaterShare_1.calculateRefundShare)(ticket, cancelledBy);
                const session = yield mongoose_1.default.connection.startSession();
                try {
                    let cancelledTicket = null;
                    yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                        // taking refund amount from theater and giving it to user
                        yield this._theaterRepository.updateWallet(ticket.theaterId, -refundByTheater, 'For Giving Refund for Ticket Cancellation');
                        yield this._userRepository.updateWallet(ticket.userId, refundByTheater, 'Ticket Cancellation Refund');
                        if (cancelledBy === 'Admin') {
                            yield this._adminRepository.updateWallet(-refundByAdmin, 'Ticket Cancellation Refund');
                            yield this._userRepository.updateWallet(ticket.userId, refundByAdmin, 'Convenience Fee Refund');
                        }
                        // code to re assign cancelled ticket seat
                        cancelledTicket = yield this._ticketRepository.cancelTicket(ticketId, cancelledBy);
                        if (cancelledTicket === null)
                            throw Error('Something went wrong while canceling ticket');
                        const show = yield this._showRepository.getShowDetails(cancelledTicket.showId);
                        yield this._showSeatRepository.markAsNotBooked(show.seatId, cancelledTicket.diamondSeats, cancelledTicket.goldSeats, cancelledTicket.silverSeats);
                    }));
                    yield session.commitTransaction();
                    return (0, response_1.get200Response)(cancelledTicket);
                }
                catch (error) {
                    console.error('Error during cancelling ticket:', error);
                    yield session.abortTransaction();
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                finally {
                    yield session.endSession();
                }
            }
            catch (error) {
                if (error instanceof refundNotAllowedError_1.RefundNotAllowedError || error instanceof cancelledByUnknownError_1.CancelledByUnknownError) {
                    return (0, response_1.getErrorResponse)(error.statusCode, error.message);
                }
                return (0, response_1.get500Response)(error);
            }
        });
    }
    sendInvoiceMail(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(ticketId, 'ticket id');
                const ticket = yield this._ticketRepository.getTicketData(ticketId);
                if (ticket) {
                    const user = yield this._userRepository.findById(ticket.userId);
                    if (user) {
                        (0, console_1.log)('sending invoice to user ', user.email);
                        yield this._mailSender.invoiceDownloadMail(user.email, ticket);
                        return (0, response_1.get200Response)(null);
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid user id in ticket');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid ticket id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTicketsOfTheater(theaterId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                const tickets = yield this._ticketRepository.getTicketsByTheaterId(theaterId, page, limit);
                const ticketCount = yield this._ticketRepository.getTicketsByTheaterIdCount(theaterId);
                (0, console_1.log)(ticketCount, 'ticketCount', tickets);
                return (0, response_1.get200Response)({ tickets, ticketCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getAllTickets(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                const tickets = yield this._ticketRepository.getAllTickets(page, limit);
                const ticketCount = yield this._ticketRepository.getAllTicketsCount();
                (0, console_1.log)(ticketCount, 'ticketCount', tickets);
                return (0, response_1.get200Response)({ tickets, ticketCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getAdminRevenue(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!startDate || !endDate) {
                    startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, // Go back one month
                    new Date().getDate() // Keep the same day of the month
                    );
                    endDate = new Date();
                }
                const tickets = yield this._ticketRepository.findTicketsByTime(startDate, endDate);
                const addedAmt = {};
                tickets.forEach(tkt => {
                    const dateKey = (0, dashboardHelpers_1.getDateKeyWithInterval)(startDate, endDate, tkt.startTime);
                    (0, console_1.log)(dateKey, 'dateKey from useCase');
                    if (!addedAmt[dateKey]) {
                        addedAmt[dateKey] = 0;
                    }
                    addedAmt[dateKey] += (0, calculateTheaterShare_1.calculateAdminShare)(tkt);
                });
                const labels = Object.keys(addedAmt);
                const data = Object.values(addedAmt);
                return (0, response_1.get200Response)({ labels, data });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.TicketUseCase = TicketUseCase;
