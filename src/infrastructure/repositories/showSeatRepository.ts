import { showSeatsModel } from "../../entities/models/showSeatModel";
import { ID } from "../../interfaces/common";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatsSchema";

export class ShowSeatsRepository { // implements IChatRepo
    async saveShowSeat (showSeat: IShowSeatToSave): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    async findShowSeatById (showSeatId: ID): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }
}