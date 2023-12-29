import { screenSeatModel } from "../../entities/models/screenSeatModel";
import { ID } from "../../interfaces/common";
import { IScreenSeatRepo } from "../../interfaces/repos/screenSeatRepo";
import { IScreenSeatRes, IScreenSeatSave } from "../../interfaces/schema/screenSeatSchema";

export class ScreenSeatRepository implements IScreenSeatRepo {
    async saveScreenSeat (screenSeat: IScreenSeatSave): Promise<IScreenSeatRes> {
        return await new screenSeatModel(screenSeat).save()
    }

    async findScreenSeatById (screenSeatId: ID): Promise<IScreenSeatRes | null> {
        return await screenSeatModel.findById(screenSeatId)
    }
}