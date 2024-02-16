import { ICoords, IUserAddress, IWalletHistory } from "./common"

export interface IUsedCoupons {
    couponId: string
    date: Date,
    ticketId: string
}

export interface IUser {
    _id: string
    name: string
    email: string
    password?: string
    mobile?: number
    dob: Date
    isBlocked: boolean
    profilePic?: string
    coords?: ICoords
    address?: IUserAddress,
    isGoogleAuth: boolean
    wallet: number
    walletHistory: IWalletHistory[],
    usedCoupons: IUsedCoupons[]
}