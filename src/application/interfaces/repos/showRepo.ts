import { IShow } from "../../../entities/show";
import { IShowRes, IShowToSave, IShowsOnAScreen } from "../types/show";

export interface IShowRepo {
    saveShow (showToSave: IShowToSave): Promise<IShow>
    findShowsOnDate  (theaterId: string, from: Date, to: Date): Promise<IShowsOnAScreen[]>
    getShowDetails (showId: string): Promise<IShow | null>
    getCollidingShowsOnTheScreen (screenId: string, startTime: Date, endTime: Date): Promise<IShowRes[]>
}
