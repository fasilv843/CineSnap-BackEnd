import { IWalletHistory } from "./common"

export interface IAdmin {
    _id: string
    email: string
    password: string,
    wallet: number
    walletHistory: IWalletHistory[]
}