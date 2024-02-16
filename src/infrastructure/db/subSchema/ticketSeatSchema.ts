import { Schema } from "mongoose";
import { ITicketSeat } from "../../../interfaces/schema/ticketSchema";

export const ticketSeatCategorySchema: Schema = new Schema<ITicketSeat & Document>({
    seats: {
        type: [String],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    singlePrice: {
        type: Number,
        required: true
    },
    CSFeePerTicket: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        requied: true
    }
})