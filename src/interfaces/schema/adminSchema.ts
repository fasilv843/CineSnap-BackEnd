import { ID, IWalletHistory } from "../common"

export interface IAdmin {
    _id: ID
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

export interface IApiAdminAuthRes {
    status: number
    message: string
    data: IAdminRes | null
    accessToken: string
    refreshToken: string
}