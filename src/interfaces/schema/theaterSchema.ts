import { IWalletHistory, ICoords, ITheaterAddress, ID } from "../common"


export interface ITheater {
    _id: ID
    name: string
    email: string
    mobile?: number
    password: string
    isBlocked: boolean
    profilePic?: string
    liscenceId: string
    screenCount: number
    wallet: number
    walletHistory: IWalletHistory[] | []
    isGoogleAuth: boolean
    coords: ICoords
    address: ITheaterAddress,
    socialMediaHandles?: Map<string, string>
}

export interface ITheaterRes {
    _id: ID
    name: string
    email: string
    mobile?: number
    isBlocked: boolean
    profilePic?: string
    liscenceId: string
    screenCount: number
    wallet: number
    walletHistory?: IWalletHistory[]
    coords: ICoords
    address: ITheaterAddress,
    socialMediaHandles?: Map<string, string>
}

export interface ITheaterUpdate extends Omit<ITheaterRes, '_id' | 'email' | 'isBlocked' | 'wallet' | 'walletHistory' | 'liscenceId' | 'screenCount'> {}

export interface ITheaterAuth {
    name: string
    email: string,
    password: string
    liscenceId: string
    coords: ICoords
    address: ITheaterAddress
}

export interface IApiTheaterRes {
    status: number
    message: string
    data: ITheaterRes | null
}

export interface IApiTheaterAuthRes {
    status: number
    message: string
    data: ITheaterRes | null
    accessToken: string
    refreshToken: string
}

export interface IApiTheatersRes {
    status: number
    message: string
    data: ITheaterRes[] | null
}