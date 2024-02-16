import { IUsedCoupons, IUser } from "../../entities/user"
import { ICouponRes } from "./couponSchema"

export interface IPopulatedUsedCoupons extends Omit<IUsedCoupons, 'couponId'> {
    couponId: ICouponRes
}

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