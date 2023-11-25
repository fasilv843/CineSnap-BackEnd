import { ID } from "../common";

export interface IScreen {
    _id: ID
    theaterId: ID,
    name: string
    defaultPrice: number,
    seatsCount: number,
    seats: Map<string, number[]>
}

export interface IScreenRequirements
    extends Omit<IScreen, '_id' | 'seatsCount' | 'seats'> {
    row: string;
    col: number;
}

export interface IApiScreenRes {
    status: number
    message: string
    data: IScreen | null
}

export interface IApiScreensRes {
    status: number
    message: string
    data: IScreen [] | []
}