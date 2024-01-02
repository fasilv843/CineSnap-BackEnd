import { showSeatsModel } from "../../entities/models/showSeatModel";
import { ID } from "../../interfaces/common";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatsSchema";
import { ITicketSeat } from "../../interfaces/schema/ticketSchema";

export class ShowSeatsRepository { // implements IChatRepo
    async saveShowSeat (showSeat: IShowSeatToSave): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    async findShowSeatById (showSeatId: ID): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

    async markAsBooked (seatId: ID, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null> {
        const showSeats = await showSeatsModel.findById(seatId) 
        if (showSeats === null) return null

        if (diamondSeats) {
            diamondSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                showSeats.diamond.seats[s[0]] = showSeats.diamond.seats[s[0]]?.map(showSeat => (showSeat.col === col) ? {...showSeat, isBooked: true }: showSeat)
            })
        }

        if (goldSeats) {
            goldSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                showSeats.gold.seats[s[0]] = showSeats.gold.seats[s[0]]?.map(showSeat => (showSeat.col === col) ? {...showSeat, isBooked: true }: showSeat)
            })
        }

        if (silverSeats) {
            silverSeats.seats.forEach(s => {
                const col = parseInt(s.slice(1))
                showSeats.silver.seats[s[0]] = showSeats.silver.seats[s[0]]?.map(showSeat => (showSeat.col === col) ? {...showSeat, isBooked: true }: showSeat)
            })
        }

        return await showSeats.save()
    }
}