import { Schema } from "mongoose"
import { IWalletHistory } from "../../../interfaces/common"
import { walletHistorySchema } from "../subSchema/walletHistorySchema"

interface IWalletSchema {
    wallet: number
    walletHistory: IWalletHistory[]
}

export const walletSchema: Schema = new Schema<IWalletSchema & Document>({
    wallet: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    walletHistory: [walletHistorySchema],
})