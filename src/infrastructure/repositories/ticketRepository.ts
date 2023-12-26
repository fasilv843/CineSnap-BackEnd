import { log } from "console";
import { showModel } from "../../entities/models/showModel";
import { ticketModel } from "../../entities/models/ticketModel";
import { ID } from "../../interfaces/common";
import { ITicketRepo } from "../../interfaces/repos/ticketRepo";
import { ITicketReqs, ITicketRes } from "../../interfaces/schema/ticketSchema";

export class TicketRepository implements ITicketRepo {
    async saveTicket (tempTicket: ITicketReqs): Promise<ITicketRes> {
        console.log(tempTicket, 'ticket data from saveTickt');
        const bookedSeats = tempTicket.seats
        log(bookedSeats, 'bookedSeats from save ticket')
        const showData = await showModel.findById(tempTicket.showId)
        if (showData) {
            // Convert Map to Object
            const showSeatsObject = Object.fromEntries(showData.seats);

            for (const [row, cols] of Object.entries(bookedSeats) as [string, number[]][]) {
                const showRow = showSeatsObject[row]
                for (const col of cols) {
                    for (const showCol of showRow) {
                        if (showCol.col === col) showCol.isBooked = true
                    }
                }
            }

            await showData.save()
            
            return await new ticketModel(tempTicket).save() as ITicketRes
        }else {
            throw Error('error during confirming ticket')
        }
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

    async cancelTicket (ticketId: ID): Promise<ITicketRes | null> {
        return await ticketModel.findByIdAndUpdate({_id: ticketId}, { isCancelled: true })
    }
}