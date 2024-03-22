import { IScreenSeatRes, IScreenSeatSave } from "../types/screenSeat"

export interface IScreenSeatRepo {
    saveScreenSeat (screenSeat: IScreenSeatSave): Promise<IScreenSeatRes>
    findScreenSeatById (screenSeatId: string): Promise<IScreenSeatRes | null>
    updateScreenSeat(screenSeat: IScreenSeatRes): Promise<IScreenSeatRes | null>
    deleteScreenSeat (seatId: string): Promise<IScreenSeatRes | null>
}