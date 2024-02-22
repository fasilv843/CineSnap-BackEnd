import mongoose, { Schema, Model } from "mongoose"
import { ITempTicketRes } from "../../../interfaces/schema/ticketSchema"
import { baseTicketSchema } from "../base/baseTicketSchema"

const tempTicketSchema: Schema = new Schema<ITempTicketRes & Document>({
    // TTL Indexing
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10 // expires after 10 mins
    }
})

tempTicketSchema.add(baseTicketSchema)

export const tempTicketModel: Model<ITempTicketRes & Document> = mongoose.model<ITempTicketRes & Document>('TempTickets', tempTicketSchema)