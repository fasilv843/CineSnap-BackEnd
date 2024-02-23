import mongoose, { Model, Schema } from "mongoose";
import { baseTicketSchema } from "./base/baseTicketSchema";
import { ITicket } from "../../entities/ticket";

interface ITicketSchema extends Omit<ITicket, 'couponId'>, Document {
    couponId: Schema.Types.ObjectId
}

const ticketSchema: Schema = new Schema<ITicketSchema>({
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

export const ticketModel: Model<ITicketSchema> = mongoose.model<ITicketSchema>('Tickets', ticketSchema)