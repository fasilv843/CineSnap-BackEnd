import { IScreen, IScreenRequirements } from "../schema/screenSchema";
import { ID } from "../common";

export interface IScreenRepo {
    saveScreen(screen: IScreenRequirements): Promise<IScreen | null>
    findScreenById(id: ID): Promise<IScreen | null>
    findScreensInTheater(theaterId: ID): Promise<IScreen[] | []>
}