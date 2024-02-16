import { ICoords, ITheaterAddress } from "../../entities/common"
import { IApiRes } from "../common"

export interface ITempTheaterReq {
    name: string
    email: string
    otp: number
    password: string
    liscenceId: string
    coords: ICoords,
    address: ITheaterAddress
}


export interface ITempTheaterRes extends ITempTheaterReq {
    _id: string
    expireAt: Date
}

export interface IApiTempTheaterRes extends IApiRes<ITempTheaterRes | null> {}