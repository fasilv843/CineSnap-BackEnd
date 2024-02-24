import { IScreen } from "../../../entities/screen";
import { IApiRes } from "./common";

export interface IScreenRequirements extends Omit<IScreen, '_id' | 'seatsCount' | 'seatId'> {}
export interface IApiScreenRes extends IApiRes<IScreen | null> {}
export interface IApiScreensRes extends IApiRes<IScreen[] | null> {}
