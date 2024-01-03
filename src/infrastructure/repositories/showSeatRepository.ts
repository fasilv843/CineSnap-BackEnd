import { log } from "console";
import { showSeatsModel } from "../../entities/models/showSeatModel";
import { ID } from "../../interfaces/common";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatsSchema";
import { ITicketSeat } from "../../interfaces/schema/ticketSchema";

export class ShowSeatsRepository { // implements IChatRepo
    async saveShowSeat (showSeat: Partial<IShowSeatToSave>): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    async findShowSeatById (showSeatId: ID): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

    async markAsBooked (seatId: ID, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null> {
        const showSeats = await showSeatsModel.findById(seatId)
        if (showSeats === null) return null

        log(showSeats, 'showSeats from markAsRead')
        log(diamondSeats, 'diamondSeats')
        log(goldSeats, 'goldSeats')
        log(silverSeats, 'silverSeats')

        if (diamondSeats) {
            diamondSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(s[0], 'row')
                const rowArr = showSeats.diamond.seats.get(s[0])
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.diamond.seats.set(s[0], updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (goldSeats) {
            goldSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(s[0], 'row')
                const rowArr = showSeats.gold.seats.get(s[0])
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.gold.seats.set(s[0], updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        if (silverSeats) {
            silverSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                log(col, 'col'), log(s[0], 'row')
                const rowArr = showSeats.silver.seats.get(s[0])
                if (rowArr) {
                    const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s)
                    showSeats.silver.seats.set(s[0], updatedRowArr)
                }
                log(rowArr, 'rowArr')
            })
        }

        return await showSeats.save()
    }
}