import mongoose, { Model, Schema } from "mongoose";
import { ITicket } from "../../interfaces/schema/ticketSchema";

const ticketSchema: Schema = new Schema<ITicket & Document>({
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
    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    cancelledBy: {
        type: String,
        enum: ['User', 'Theater', 'Admin'],
        required () {
            return this.isCancelled
        }        
    },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Razorpay'],
        default: 'Razorpay',  // Delete after Implementation
        required: true
    }
},
{
    timestamps: true
})

export const ticketModel: Model<ITicket & Document> = mongoose.model<ITicket & Document>('Tickets', ticketSchema)