import { IAddress, Location } from "./common"

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
    location?: Location
    address?: IAddress
}
