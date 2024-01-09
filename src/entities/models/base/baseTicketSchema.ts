import { Schema } from "mongoose";
import { ITempTicketRes } from "../../../interfaces/schema/ticketSchema";
import { ticketSeatCategorySchema } from "../subSchema/ticketSeatSchema";

export const baseTicketSchema: Schema = new Schema<ITempTicketRes & Document>({
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
    totalPrice: {
        type: Number,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    diamondSeats: ticketSeatCategorySchema,
    goldSeats: ticketSeatCategorySchema,
    silverSeats: ticketSeatCategorySchema,
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
});
