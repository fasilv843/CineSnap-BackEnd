import { ID } from "../common"

export interface ITempUserReq {
    name: string
    email: string
    otp: number
    password: string
}

// export interface ITempUserRes extends Omit<ITempUserReq, '_id'>{}
export interface ITempUserRes extends ITempUserReq {
    _id: ID
    expireAt: Date
}