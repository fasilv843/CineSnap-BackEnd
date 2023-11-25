import mongoose, { Model, Schema } from "mongoose";
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { walletHistorySchema } from "./common/walletHistorySchema";

const adminSchema: Schema = new Schema<IAdmin & Document>({
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required: true
    },
    wallet: {
        type: Number,
        default: 0,
        required: true
    },
    walletHistory: [walletHistorySchema],
})

export const adminModel: Model< IAdmin & Document> = mongoose.model< IAdmin & Document>('Admin', adminSchema)