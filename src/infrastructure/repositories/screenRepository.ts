import { IScreen } from "../../entities/screen";
import { IScreenRepo } from "../../useCases/repos/screenRepo";
import { screenModel } from "../db/screensModel";

export class ScreenRepository implements IScreenRepo {
    async saveScreen(screenData: Omit<IScreen, '_id'>): Promise<IScreen> {
        return await new screenModel(screenData).save() as unknown as IScreen
    }

    async findScreenById(id: string): Promise<IScreen | null> {
        return await screenModel.findById({_id: id})
    }

    async findScreensInTheater(theaterId: string): Promise<IScreen[]> {
        return await screenModel.find({theaterId})
    }

    async updateScreenName (screenId: string, screenName: string): Promise<IScreen | null> {
        return await screenModel.findByIdAndUpdate(
            { _id: screenId },
            {
                $set: { name: screenName }
            },
            { new: true }
        )
    }

    async deleteScreen (screenId: string): Promise<IScreen | null> {
        return await screenModel.findByIdAndDelete(screenId)
    }

    async updateSeatCount (seatId: string, seatsCount: number, rows: string): Promise<IScreen | null> {
        return await screenModel.findOneAndUpdate (
            { seatId },
            {
                $set: { seatsCount, rows }
            },
            { new: true }
        )
    }
}