import { ITempTicketRes, ITicketRes } from "../../interfaces/schema/ticketSchema"

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