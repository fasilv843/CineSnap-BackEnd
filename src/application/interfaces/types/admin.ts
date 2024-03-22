import { IWalletHistory } from "../../../entities/common"

export interface IAdminRes {
    email: string
    wallet: number
    walletHistory: IWalletHistory[]
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