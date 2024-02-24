import { IScreen } from "../../../entities/screen";

export interface IScreenRepo {
    saveScreen(screenData: Omit<IScreen, '_id'>): Promise<IScreen>
    findScreenById(id: string): Promise<IScreen | null>
    findScreensInTheater(theaterId: string): Promise<IScreen[]>
    updateScreenName (screenId: string, screenName: string): Promise<IScreen | null>
    deleteScreen (screenId: string): Promise<IScreen | null>
    updateSeatCount (seatId: string, seatsCount: number, rows: string): Promise<IScreen | null>
}