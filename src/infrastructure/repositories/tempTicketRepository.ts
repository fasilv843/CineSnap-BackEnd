import { tempTicketModel } from "../../entities/models/temp/tempTicketModel";
import { ID } from "../../interfaces/common";
import { ITempTicketRepo } from "../../interfaces/repos/tempTicketRepo";
import { ITempTicketRes, ITempTicketReqs, Seats } from "../../interfaces/schema/ticketSchema";

export class TempTicketRepository implements ITempTicketRepo {
    async saveTicketDataTemporarily (ticketData: ITempTicketReqs): Promise<ITempTicketRes> {
        return await new tempTicketModel(ticketData).save()
    }

    async getTicketData (ticketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findById(ticketId).populate('movieId').populate('showId').populate('screenId').populate('theaterId')
    }

    async findTempTicketById (ticketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findById(ticketId).select({ _id: 0, expireAt: 0 }) as ITempTicketRes
    }

    async getTicketDataWithoutPopulate (ticketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findByIdAndDelete(ticketId).select({ _id: 0, expireAt: 0 }) as ITempTicketRes
    }

    async deleteTicketData (tempTicketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findByIdAndDelete(tempTicketId)
    }

    async getHoldedSeats (showId: ID): Promise<Seats> {
        return await tempTicketModel.find({ showId }, { _id: 0, diamondSeats: 1, goldSeats: 1, silverSeats: 1 })
    }
}