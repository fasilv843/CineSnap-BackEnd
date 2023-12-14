import { ISelectedSeat } from "../../interfaces/schema/ticketSchema"

export function getSeatMap(seats: ISelectedSeat[]): Map<string, number[]> {
    const seatsMap = new Map<string, number[]>()
    for (const seat of seats) {
        if (seatsMap.get(seat.row) !== undefined) {
            seatsMap.get(seat.row)?.push(seat.col)
        } else {
            seatsMap.set(seat.row, [seat.col])
        }
    }
    console.log(seatsMap, 'seatsMap from getSeatmap method')
    return seatsMap
}