import { ColType, IApiRes, ID } from "../common"

export interface IScreenSeatCategory {
    name: string,
    seats: Map<string, ColType[]>
}

export interface IScreenSeat {
    _id: ID
    diamond: IScreenSeatCategory
    gold: IScreenSeatCategory
    silver: IScreenSeatCategory
}

export interface IScreenSeatRes extends IScreenSeat {}
export interface IApiScreenSeatRes extends IApiRes<IScreenSeatRes | null> {}

export interface IScreenSeatCategorySave extends Omit<IScreenSeatCategory, 'name'> {
    seats: Map<string, ColType[]>
}

export interface IScreenSeatSave {
    diamond: IScreenSeatCategorySave
    gold: IScreenSeatCategorySave
    silver: IScreenSeatCategorySave
}
