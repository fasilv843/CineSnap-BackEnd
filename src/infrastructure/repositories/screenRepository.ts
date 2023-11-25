import { IScreenRepo } from "../../interfaces/repos/screenRepo";
import { IScreenRequirements, IScreen } from "../../interfaces/schema/screenSchema";
import { screenModel } from "../../entities/models/screensModel";
import { ID } from "../../interfaces/common";

export class ScreenRepository implements IScreenRepo {
    async saveScreen(screen: IScreenRequirements): Promise<IScreen> {
        return await new screenModel(screen).save()
    }
    async findScreenById(id: ID): Promise<IScreen | null> {
        return await screenModel.findById({_id: id})
    }
    async findScreensInTheater(theaterId: ID): Promise<[] | IScreen[]> {
        return await screenModel.find({theaterId})
    }
}