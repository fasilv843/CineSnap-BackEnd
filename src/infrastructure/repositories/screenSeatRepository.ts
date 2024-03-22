import { screenSeatModel } from "../db/screenSeatModel";
import { IScreenSeatRepo } from "../../application/interfaces/repos/screenSeatRepo";
import { IScreenSeatRes, IScreenSeatSave } from "../../application/interfaces/types/screenSeat";

export class ScreenSeatRepository implements IScreenSeatRepo {
    async saveScreenSeat (screenSeat: IScreenSeatSave): Promise<IScreenSeatRes> {
        return await new screenSeatModel(screenSeat).save()
    }

    async findScreenSeatById (screenSeatId: string): Promise<IScreenSeatRes | null> {
        return await screenSeatModel.findById(screenSeatId)
    }

    async updateScreenSeat(screenSeat: IScreenSeatRes): Promise<IScreenSeatRes | null> {
        return await screenSeatModel.findByIdAndUpdate(
            { _id: screenSeat._id },
            {
                $set: {
                    diamond: screenSeat.diamond,
                    gold: screenSeat.gold,
                    silver: screenSeat.silver
                }
            }
        )
    }

    async deleteScreenSeat (seatId: string): Promise<IScreenSeatRes | null> {
        return await screenSeatModel.findByIdAndDelete(seatId)
    }
}