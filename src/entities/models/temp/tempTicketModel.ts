import mongoose, { Schema, Model } from "mongoose"
import { ITempTicketRes } from "../../../interfaces/schema/ticketSchema"

const tempTicketSchema: Schema = new Schema<ITempTicketRes & Document>({
    showId: {
        type: Schema.Types.ObjectId,
        required: [true, 'showId is required'],
        ref: 'Shows'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: [true, 'movieId is required'],
        ref: 'Movies'
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        required: [true, 'theaterId is required'],
        ref: 'Theaters'
    },
    screenId: {
        type: Schema.Types.ObjectId,
        required: [true, 'screenId is required'],
        ref: 'Screens'
    },
    singlePrice: {
        type: Number,
        required: true
    },
    feePerTicket: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    seats: {
        type: Map,
        of: [Number]
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10 // expires after 10 mins
    }
})

// tempTicketSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 10 });


export const tempTicketModel: Model<ITempTicketRes & Document> = mongoose.model<ITempTicketRes & Document>('TempTickets', tempTicketSchema)