"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRefundShare = exports.calculateAdminShare = exports.calculateTheaterShare = void 0;
const constants_1 = require("../../constants/constants");
const cancelledByUnknownError_1 = require("../errors/cancelledByUnknownError");
const refundNotAllowedError_1 = require("../errors/refundNotAllowedError");
const date_1 = require("./date");
function calculateTheaterShare(ticket) {
    let price = 0;
    if (ticket.diamondSeats !== undefined) {
        price += ticket.diamondSeats.seats.length * ticket.diamondSeats.singlePrice;
    }
    if (ticket.goldSeats !== undefined) {
        price += ticket.goldSeats.seats.length * ticket.goldSeats.singlePrice;
    }
    if (ticket.silverSeats !== undefined) {
        price += ticket.silverSeats.seats.length * ticket.silverSeats.singlePrice;
    }
    return price;
}
exports.calculateTheaterShare = calculateTheaterShare;
function calculateAdminShare(ticket) {
    let price = 0;
    if (ticket.diamondSeats !== undefined) {
        price += ticket.diamondSeats.seats.length * ticket.diamondSeats.CSFeePerTicket;
    }
    if (ticket.goldSeats !== undefined) {
        price += ticket.goldSeats.seats.length * ticket.goldSeats.CSFeePerTicket;
    }
    if (ticket.silverSeats !== undefined) {
        price += ticket.silverSeats.seats.length * ticket.silverSeats.CSFeePerTicket;
    }
    return price;
}
exports.calculateAdminShare = calculateAdminShare;
function calculateRefundShare(ticket, cancelledBy) {
    let refundByTheater;
    let refundByAdmin = 0;
    if (cancelledBy === 'User') {
        const hourDiff = (0, date_1.calculateHoursDifference)(ticket.startTime);
        // Calculationg refund amount based on hours difference
        if (hourDiff <= constants_1.NoRefundTime)
            throw new refundNotAllowedError_1.RefundNotAllowedError('Refund is not allowed if there is only 4 or less hours left');
        const totalPrice = calculateTheaterShare(ticket);
        let refundAmount;
        if (hourDiff <= constants_1.QuarterRefundTime)
            refundAmount = (totalPrice * 25) / 100;
        else if (hourDiff <= constants_1.HalfRefundTime)
            refundAmount = (totalPrice * 50) / 100;
        else if (hourDiff <= constants_1.ThreeQuarterRefundTime)
            refundAmount = (totalPrice * 75) / 100;
        else
            refundAmount = totalPrice;
        refundByTheater = refundAmount;
    }
    else if (cancelledBy === 'Theater') {
        refundByTheater = ticket.totalPrice;
    }
    else if (cancelledBy === 'Admin') {
        refundByTheater = calculateTheaterShare(ticket);
        refundByAdmin = calculateAdminShare(ticket);
    }
    else {
        throw new cancelledByUnknownError_1.CancelledByUnknownError('Ooops!, Cancellation from unknown user');
    }
    return { refundByTheater, refundByAdmin };
}
exports.calculateRefundShare = calculateRefundShare;
