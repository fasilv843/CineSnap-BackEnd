// import { NoRefundTime, QuarterRefundTime, HalfRefundTime, ThreeQuarterRefundTime } from "../../constants/constants"
// import { STATUS_CODES } from "../../constants/httpStausCodes"
// import { CancelledBy } from "../../interfaces/common"
import { ITempTicketRes, ITicketRes } from "../../interfaces/schema/ticketSchema"
// import { calculateHoursDifference } from "./date"
// import { getErrorResponse } from "./response"

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

// export function calculateRefundShare (ticket: ITicketRes, cancelledBy: CancelledBy): { refundByTheater: number, refundByAdmin: number } {
//     let refundByTheater: number;
//     let refundByAdmin: number = 0;
//     if (cancelledBy === 'User') {
//         const hourDiff = calculateHoursDifference(ticket.startTime)

//         // Calculationg refund amount based on hours difference
//         if (hourDiff <= NoRefundTime) return Error('Ooops!, Cancellation from unknown user')
//         const totalPrice = calculateTheaterShare(ticket)
//         let refundAmount: number;
//         if (hourDiff <= QuarterRefundTime) refundAmount = (totalPrice * 25)/100
//         else if (hourDiff <= HalfRefundTime) refundAmount = (totalPrice * 50)/100
//         else if (hourDiff <= ThreeQuarterRefundTime) refundAmount = (totalPrice * 75)/100
//         else refundAmount = totalPrice

//         refundByTheater = refundAmount
//     } else if (cancelledBy === 'Theater') {
//         refundByTheater = ticket.totalPrice
//     } else if (cancelledBy === 'Admin') {
//         refundByTheater = calculateTheaterShare(ticket)
//         refundByAdmin = calculateAdminShare(ticket)
//     } else {
//         return Error('Ooops!, Cancellation from unknown user')
//     }

//     return { refundByTheater, refundByAdmin }
// }