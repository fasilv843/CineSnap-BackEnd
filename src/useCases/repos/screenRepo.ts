import { IScreen, IScreenRequirements } from "../../interfaces/schema/screenSchema";

export interface IScreenRepo {
    saveScreen(screen: IScreenRequirements): Promise<IScreen | null>
    findScreenById(id: string): Promise<IScreen | null>
    findScreensInTheater(theaterId: string): Promise<IScreen[] | []>
}