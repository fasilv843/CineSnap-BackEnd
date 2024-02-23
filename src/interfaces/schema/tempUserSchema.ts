import { ITempUser } from "../../entities/temp/tempUser"

export interface ITempUserReq extends Omit<ITempUser, '_id' | 'expireAt'> {}

export interface ITempUserRes extends ITempUser {}
