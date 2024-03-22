import { ColType } from "./common"

export interface IScreenSeatCategory {
    name: string,
    seats: Map<string, ColType[]>
}

export interface IScreenSeat {
    _id: string
    diamond: IScreenSeatCategory
    gold: IScreenSeatCategory
    silver: IScreenSeatCategory
}