import mongoose, { Model, Schema } from "mongoose";
import { ITicket } from "../../interfaces/schema/ticketSchema";
import { baseTicketSchema } from "./base/baseTicketSchema";

const ticketSchema: Schema = new Schema<ITicket & Document>({
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
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupons'
    }
},
{
    timestamps: true
})

ticketSchema.add(baseTicketSchema)

export const ticketModel: Model<ITicket & Document> = mongoose.model<ITicket & Document>('Tickets', ticketSchema)