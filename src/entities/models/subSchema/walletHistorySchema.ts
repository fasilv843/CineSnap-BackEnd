import { Schema } from "mongoose";
import { IWalletHistory } from "../../../interfaces/common";

export const walletHistorySchema: Schema = new Schema<IWalletHistory & Document>({
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Date field is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
});
