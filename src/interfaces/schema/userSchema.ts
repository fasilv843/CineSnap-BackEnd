import { IUserAddress, ICoords, IWalletHistory } from "../common"

// interface specifically for userSchema
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
    walletHistory: IWalletHistory[] | []
}

// interface to respond to front end
export interface IUserRes {
    _id: string
    name: string
    email: string
    password?: string
    mobile?: number
    dob: Date
    isBlocked: boolean
    profilePic?: string
    wallet: number
    coords?: ICoords
    address?: IUserAddress,
    walletHistory: IWalletHistory[] | []
}

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
    token: string
}

// api response for multiple users as data
export interface IApiUsersRes {
    status: number
    message: string
    data: IUserRes[] | []
    token: string
}
