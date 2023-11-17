import { IAddress, ILocation } from "./common"

export interface IUser {
    _id?: string
    name: string
    email: string
    password: string
    mobile?: number
    dob?: Date
    isBlocked: boolean
    profilePic: string
    wallet?: number | null
    location?: ILocation
    address?: IAddress
}
