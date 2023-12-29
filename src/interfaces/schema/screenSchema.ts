import { IApiRes, ID } from "../common";

export interface IScreen {
    _id: ID
    theaterId: ID
    name: string
    rows: string
    cols: number
    seatsCount: number
    seatId: ID
}

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seatId'> {}
export interface IApiScreenRes extends IApiRes<IScreen | null> {}
export interface IApiScreensRes extends IApiRes<IScreen[] | null> {}
