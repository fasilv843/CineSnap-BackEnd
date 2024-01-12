import { log } from "console";
import { showSeatsModel } from "../../entities/models/showSeatModel";
import { ID, RowType } from "../../interfaces/common";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatsSchema";
import { ITicketSeat } from "../../interfaces/schema/ticketSchema";

export class ShowSeatsRepository { // implements IChatRepo

    // Save new seat document for each show newly created
    async saveShowSeat (showSeat: Partial<IShowSeatToSave>): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    // To get the document using _id
    async findShowSeatById (showSeatId: ID): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

    // To Change isBooked to true, when someone books a show
    async markAsBooked (seatId: ID, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null> {
        const showSeats = await showSeatsModel.findById(seatId)
        if (showSeats === null) return null

        log(showSeats, 'showSeats from markAsRead')
        log(diamondSeats, 'diamondSeats')
        log(goldSeats, 'goldSeats')
        log(silverSeats, 'silverSeats')

        if (diamondSeats) {
            diamondSeats.seats.forEach(s => {
                const row = s[0] as RowType
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.diamond.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.diamond.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (goldSeats) {
            goldSeats.seats.forEach(s => {
                const row = s[0] as RowType
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.gold.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.gold.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (silverSeats) {
            silverSeats.seats.forEach(s => {
                const row = s[0] as RowType
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.silver.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.silver.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        return await showSeats.save()
    }

    // To Change isBooked to false, when someone cancels a show
    async markAsNotBooked  (seatId: ID, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null> {
        const showSeats = await showSeatsModel.findById(seatId)
        if (showSeats === null) return null

        log(showSeats, 'showSeats from markAsRead')
        log(diamondSeats, 'diamondSeats')
        log(goldSeats, 'goldSeats')
        log(silverSeats, 'silverSeats')

        if (diamondSeats) {
            diamondSeats.seats.forEach(s => {
                const row = s[0] as RowType
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.diamond.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s)
                    showSeats.diamond.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (goldSeats) {
            goldSeats.seats.forEach(s => {
                const row = s[0] as RowType
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.gold.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s)
                    showSeats.gold.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (silverSeats) {
            silverSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                const row = s[0] as RowType
                log(col, 'col'), log(row, 'row')
                const rowArr = showSeats.silver.seats.get(row)
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s)
                    showSeats.silver.seats.set(row, updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        return await showSeats.save()
    }
}