import { Schema } from "mongoose";
import { IWalletHistory } from "../../../interfaces/common";

export const walletHistorySchema: Schema = new Schema<IWalletHistory & Document>({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
