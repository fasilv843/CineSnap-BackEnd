import { IScreen } from "../../entities/screen";
import { IApiRes } from "../common";

// export interface IScreen {
//     _id: string
//     theaterId: string
//     name: string
//     rows: string
//     cols: number
//     seatsCount: number
//     seatId: string
// }

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seatId'> {}
export interface IApiScreenRes extends IApiRes<IScreen | null> {}
export interface IApiScreensRes extends IApiRes<IScreen[] | null> {}
