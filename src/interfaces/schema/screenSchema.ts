import { IApiRes, ID } from "../common";

export interface IScreen {
    _id: ID
    theaterId: ID
    name: string
    row: string
    col: number
    seatsCount: number
    seats: Map<string, number[]>
}

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seats'> {}
export interface IApiScreenRes extends IApiRes<IScreen | null> {}
export interface IApiScreensRes extends IApiRes<IScreen[] | null> {}
