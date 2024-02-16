import { ColType, IApiRes } from "../common"

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

export interface IAvailCatsOnScreen {
    diamond: string | undefined
    gold: string | undefined
    silver: string | undefined
}