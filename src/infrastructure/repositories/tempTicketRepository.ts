import { tempTicketModel } from "../../entities/models/tempTicketModel";
import { ID } from "../../interfaces/common";
import { ITempTicketRepo } from "../../interfaces/repos/tempTicketRepo";
import { ITempTicketRes, ITicketReqs, Seats } from "../../interfaces/schema/ticketSchema";
import { getSeatMap } from "../helperFunctions/seatDataToMap";

export class TempTicketRepository implements ITempTicketRepo {
    async saveTicketDataTemporarily (ticketData: ITicketReqs): Promise<ITempTicketRes> {

        const seats = getSeatMap(ticketData.seats)
        console.log(ticketData, seats, 'ticket data from saveTickt, not implimented')
        return await new tempTicketModel({...ticketData, seats: seats}).save()
    }

    async getTicketData (ticketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findById(ticketId)
    }

    async deleteTicketData (tempTicketId: ID): Promise<boolean> {
        try {
            await tempTicketModel.findByIdAndDelete(tempTicketId)
            return true
        } catch (error) {
            console.log(error, 'error whle deleting ticket');
            return false
        }
    }

    async getHoldedSeats (showId: ID): Promise<Seats> {
        return await tempTicketModel.find({ showId }, { _id: 0, seats: 1 })
    }
}