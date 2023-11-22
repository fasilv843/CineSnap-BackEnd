import { IAddress, ICoords } from "./common"

export interface IUser {
    _id?: string
    name: string
    email: string
    password?: string
    mobile?: number
    dob?: Date
    isBlocked?: boolean
    profilePic?: string
    wallet?: number | null
    coords?: ICoords
    address?: IAddress,
    isGoogleAuth?: boolean
}
