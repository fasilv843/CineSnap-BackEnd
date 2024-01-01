import { IScreenRepo } from "../../interfaces/repos/screenRepo";
import { screenModel } from "../../entities/models/screensModel";
import { ID } from "../../interfaces/common";
import { IScreen } from "../../interfaces/schema/screenSchema";

export class ScreenRepository implements IScreenRepo {
    async saveScreen(screenData: Omit<IScreen, '_id'>): Promise<IScreen> {
        return await new screenModel(screenData).save()
    }

    async findScreenById(id: ID): Promise<IScreen | null> {
        return await screenModel.findById({_id: id})
    }

    async findScreensInTheater(theaterId: ID): Promise<IScreen[]> {
        return await screenModel.find({theaterId})
    }

    async updateScreenName (screenId: ID, screenName: string): Promise<IScreen | null> {
        return await screenModel.findByIdAndUpdate(
            { _id: screenId },
            {
                $set: { name: screenName }
            },
            { new: true }
        )
    }

    async deleteScreen (screenId: ID): Promise<IScreen | null> {
        return await screenModel.findByIdAndDelete(screenId)
    }

    async updateSeatCount (seatId: ID, seatsCount: number, rows: string): Promise<IScreen | null> {
        return await screenModel.findOneAndUpdate (
            { seatId },
            {
                $set: { seatsCount, rows }
            },
            { new: true }
        )
    }
}