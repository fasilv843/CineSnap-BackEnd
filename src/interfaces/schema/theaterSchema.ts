import { IWalletHistory, ICoords, ITheaterAddress } from "../common"


export interface ITheater {
    _id: string
    name: string
    email: string
    mobile?: number
    password: string
    isBlocked: boolean
    profilePic?: string
    liscenceId: string
    wallet: number
    walletHistory: IWalletHistory[] | []
    isGoogleAuth: boolean
    coords: ICoords
    address: ITheaterAddress,
    socialMediaHandles?: Map<string, string>
}

export interface ITheaterRes {
    _id: string
    name: string
    email: string
    mobile?: number
    isBlocked: boolean
    profilePic?: string
    liscenceId: string
    wallet: number
    walletHistory?: IWalletHistory[]
    coords: ICoords
    address: ITheaterAddress,
    socialMediaHandles?: Map<string, string>
}

export interface ITheaterUpdate extends Omit<ITheaterRes, '_id' | 'email' | 'isBlocked' | 'wallet' | 'walletHistory' | 'liscenceId'> {}

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
    token: string
}

export interface IApiTheatersRes {
    status: number
    message: string
    data: ITheaterRes[]
    token: string
}