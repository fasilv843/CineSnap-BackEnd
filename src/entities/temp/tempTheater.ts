import { ICoords, ITheaterAddress } from "../common"

export interface ITempTheater {
    _id: string
    name: string
    email: string
    otp: number
    password: string
    liscenceId: string
    coords: ICoords,
    address: ITheaterAddress
    expireAt: Date
}
