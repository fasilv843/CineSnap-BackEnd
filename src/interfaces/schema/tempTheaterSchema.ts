import { ITempTheater } from "../../entities/temp/tempTheater"
import { IApiRes } from "../common"

export interface ITempTheaterReq extends Omit<ITempTheater, '_id' | 'expireAt'> {}

export interface ITempTheaterRes extends ITempTheater {}

export interface IApiTempTheaterRes extends IApiRes<ITempTheaterRes | null> {}