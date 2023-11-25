import { IWalletHistory } from "../common"

export interface IAdmin {
    _id: string
    email: string
    password: string,
    wallet: number
    walletHistory: IWalletHistory[] | []
}

export interface IAdminRes {
    email: string
    wallet: number
    walletHistory: IWalletHistory[] | []
}

export interface IApiAdminRes {
    status: number
    message: string
    data: IAdminRes | null
    token: string
}