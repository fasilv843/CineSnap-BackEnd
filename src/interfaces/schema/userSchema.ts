// import { ICoords, IUserAddress, IWalletHistory } from "../../entities/common"
import { IUsedCoupons, IUser } from "../../entities/user"
// import { ID } from "../common"
import { ICouponRes } from "./couponSchema"

// export interface IUsedCoupons {
//     couponId: string
//     date: Date,
//     ticketId: string
// }

export interface IPopulatedUsedCoupons extends Omit<IUsedCoupons, 'couponId'> {
    couponId: ICouponRes
}

// interface specifically for userSchema
// export interface IUser {
//     _id: ID
//     name: string
//     email: string
//     password?: string
//     mobile?: number
//     dob: Date
//     isBlocked: boolean
//     profilePic?: string
//     coords?: ICoords
//     address?: IUserAddress,
//     isGoogleAuth: boolean
//     wallet: number
//     walletHistory: IWalletHistory[]
//     usedCoupons: IUsedCoupons[]
// }

// interface to respond to front end
export interface IUserRes extends IUser { }

export interface IUserUpdate extends Omit<IUserRes, '_id' | 'email' | 'password' | 'isBlocked' | 'wallet' | 'walletHistory'> { }


// for social auth credentials
export interface IUserSocialAuth {
    name: string
    email: string
    profilePic?: string
}

// auth credentials
export interface IUserAuth {
    name: string
    email: string
    password: string
}

// api response for single user as data
export interface IApiUserRes {
    status: number
    message: string
    data: IUserRes | null
}

export interface IApiUserAuthRes extends IApiUserRes {
    accessToken: string
    refreshToken: string
}

// api response for multiple users as data
export interface IApiUsersRes {
    status: number
    message: string
    data: IUserRes[] | null
}

export interface IUsersAndCount {
    users: IUserRes[],
    userCount: number
}