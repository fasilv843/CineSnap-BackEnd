import { IApiRes, ID } from "../common"

export interface ISingleScreenSeat {
    col: number,
    isDummy: boolean
}

export interface IScreenSeatCategory {
    name: string,
    seats: Map<string, ISingleScreenSeat[]>
}

export interface IScreenSeat {
    _id: ID
    diamond: IScreenSeatCategory
    gold: IScreenSeatCategory
    silver: IScreenSeatCategory
}

export interface IScreenSeatRes extends IScreenSeat {}
export interface IApiScreenSeatRes extends IApiRes<IScreenSeat | null> {}

export interface ISingleScreenSeatSave extends Omit<ISingleScreenSeat, 'isDummy'> {}

export interface IScreenSeatCategorySave {
    seats: Map<string, ISingleScreenSeatSave[]>
}

export interface IScreenSeatSave {
    diamond: IScreenSeatCategorySave
    gold: IScreenSeatCategorySave
    silver: IScreenSeatCategorySave
}
