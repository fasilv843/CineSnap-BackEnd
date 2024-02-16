import { NoRefundTime, QuarterRefundTime, HalfRefundTime, ThreeQuarterRefundTime } from "../constants/constants"
import { CancelledBy } from "../../interfaces/common"
import { ITempTicketRes, ITicketRes } from "../../interfaces/schema/ticketSchema"
import { CancelledByUnknownError } from "../errors/cancelledByUnknownError"
import { RefundNotAllowedError } from "../errors/refundNotAllowedError"
import { calculateHoursDifference } from "./date"

export function calculateTheaterShare (ticket: ITempTicketRes | ITicketRes): number {
    let price = 0
    if (ticket.diamondSeats !== undefined) {
      price += ticket.diamondSeats.seats.length * ticket.diamondSeats.singlePrice
    }
    if (ticket.goldSeats !== undefined) {
      price += ticket.goldSeats.seats.length * ticket.goldSeats.singlePrice
    }
    if (ticket.silverSeats !== undefined) {
      price += ticket.silverSeats.seats.length * ticket.silverSeats.singlePrice
    }
    return price
}

export function calculateAdminShare (ticket: ITempTicketRes | ITicketRes): number {
    let price = 0
    if (ticket.diamondSeats !== undefined) {
      price += ticket.diamondSeats.seats.length * ticket.diamondSeats.CSFeePerTicket
    }
    if (ticket.goldSeats !== undefined) {
      price += ticket.goldSeats.seats.length * ticket.goldSeats.CSFeePerTicket
    }
    if (ticket.silverSeats !== undefined) {
      price += ticket.silverSeats.seats.length * ticket.silverSeats.CSFeePerTicket
    }
    return price
}

export function calculateRefundShare (ticket: ITicketRes, cancelledBy: CancelledBy): { refundByTheater: number, refundByAdmin: number } {
    let refundByTheater: number;
    let refundByAdmin: number = 0;
    if (cancelledBy === 'User') {
        const hourDiff = calculateHoursDifference(ticket.startTime)

        // Calculationg refund amount based on hours difference
        if (hourDiff <= NoRefundTime) throw new RefundNotAllowedError('Refund is not allowed if there is only 4 or less hours left')
        const totalPrice = calculateTheaterShare(ticket)
        let refundAmount: number;
        if (hourDiff <= QuarterRefundTime) refundAmount = (totalPrice * 25)/100
        else if (hourDiff <= HalfRefundTime) refundAmount = (totalPrice * 50)/100
        else if (hourDiff <= ThreeQuarterRefundTime) refundAmount = (totalPrice * 75)/100
        else refundAmount = totalPrice

        refundByTheater = refundAmount
    } else if (cancelledBy === 'Theater') {
        refundByTheater = ticket.totalPrice
    } else if (cancelledBy === 'Admin') {
        refundByTheater = calculateTheaterShare(ticket)
        refundByAdmin = calculateAdminShare(ticket)
    } else {
        throw new CancelledByUnknownError('Ooops!, Cancellation from unknown user')
    }

    return { refundByTheater, refundByAdmin }
}