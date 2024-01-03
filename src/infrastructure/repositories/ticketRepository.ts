import { ticketModel } from "../../entities/models/ticketModel";
import { ID } from "../../interfaces/common";
import { ITicketRepo } from "../../interfaces/repos/ticketRepo";
import { ITempTicketRes, ITicketRes } from "../../interfaces/schema/ticketSchema";

export class TicketRepository implements ITicketRepo {
    async saveTicket (tempTicket: ITempTicketRes): Promise<ITicketRes> {
        return await new ticketModel(tempTicket).save()
    }

    async findTicketById (ticketId: ID): Promise<ITicketRes | null> {
        return await ticketModel.findById(ticketId)
    }

    async getTicketData (ticketId: ID): Promise<ITicketRes | null> {
        return await ticketModel.findById(ticketId).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    async getTicketsByUserId (userId: ID): Promise<ITicketRes[]> {
        return await ticketModel.find({ userId }).sort({ createdAt: -1 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    async getTicketsByTheaterId (theaterId: ID, page: number, limit: number): Promise<ITicketRes[]> {
        return await ticketModel.find({ theaterId }).skip((page -1) * limit)
        .limit(limit).sort({ createdAt: -1 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId').populate('userId')
    }

    async getTicketsByTheaterIdCount(theaterId: ID): Promise<number> {
        return await ticketModel.countDocuments({ theaterId }).exec();
    }

    async getTicketsByShowId (showId: ID): Promise<ITicketRes[]> {
        return await ticketModel.find({ showId }).sort({ createdAt: -1 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    async getAllTickets (page: number, limit: number): Promise<ITicketRes[]> {
        return await ticketModel.find({}).skip((page -1) * limit).limit(limit).sort({ createdAt: -1 })
        .populate('userId').populate('movieId').populate('theaterId') as ITicketRes[]
    }

    async getAllTicketsCount(): Promise<number> {
        return await ticketModel.countDocuments({}).exec();
    }

    async cancelTicket (ticketId: ID, cancelledBy: 'User' | 'Theater' | 'Admin' = 'User'): Promise<ITicketRes | null> {
        return await ticketModel.findByIdAndUpdate(
            { _id: ticketId },
            {
                $set:{
                    isCancelled: true,
                    cancelledBy
                }
            }
        )
    }
}