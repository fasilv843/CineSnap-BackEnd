import { ColType } from "../../entities/common"
import { IScreenSeat, IScreenSeatCategory } from "../../entities/screenSeat"
import { IApiRes } from "../common"

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