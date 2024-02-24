import { log } from "console";
import { ticketModel } from "../db/ticketModel";
import { ITicketRepo } from "../../application/interfaces/repos/ticketRepo";
import { ISaveRequestReqs, ITicketRes } from "../../application/interfaces/types/ticket";

export class TicketRepository implements ITicketRepo {
    async saveTicket (tempTicket: ISaveRequestReqs): Promise<ITicketRes> {
        return await new ticketModel(tempTicket).save() as unknown as ITicketRes
    }

    async findTicketById (ticketId: string): Promise<ITicketRes | null> {
        return await ticketModel.findById(ticketId)
    }

    async getTicketData (ticketId: string): Promise<ITicketRes | null> {
        return await ticketModel.findById(ticketId).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    async getTicketsByUserId (userId: string): Promise<ITicketRes[]> {
        return await ticketModel.find({ userId }).sort({ createdAt: -1 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    async getTicketsByTheaterId (theaterId: string, page: number, limit: number): Promise<ITicketRes[]> {
        return await ticketModel.find({ theaterId }).skip((page -1) * limit)
        .limit(limit).sort({ createdAt: -1 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId').populate('userId')
    }

    async getTicketsOfTheaterByTime (theaterId: string, startDate: Date, endDate: Date): Promise<ITicketRes[]> {
        log(startDate, endDate, 'start and end from getTickets of Theater by time')
        return await ticketModel.find(
            { 
                theaterId,
                isCancelled: false,
                $and: [
                    { startTime: { $gte: startDate } }, // Date is greater than or equal to startDate
                    { startTime: { $lte: endDate } } // Date is less than or equal to endDate
                ]
            }
        )
    }

    async findTicketsByTime (startDate: Date, endDate: Date): Promise<ITicketRes[]> {
        log(startDate, endDate, 'start and end from getTickets of Theater by time')
        return await ticketModel.find(
            {
                isCancelled: false,
                $and: [
                    { startTime: { $gte: startDate } }, // Date is greater than or equal to startDate
                    { startTime: { $lte: endDate } } // Date is less than or equal to endDate
                ]
            }
        )
    }

    async getTicketsByTheaterIdCount(theaterId: string): Promise<number> {
        return await ticketModel.countDocuments({ theaterId }).exec();
    }

    async getTicketsByShowId (showId: string): Promise<ITicketRes[]> {
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

    async cancelTicket (ticketId: string, cancelledBy: 'User' | 'Theater' | 'Admin'): Promise<ITicketRes | null> {
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