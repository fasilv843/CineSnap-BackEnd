import { showSeatsModel } from "../../entities/models/showSeatModel";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatsSchema";

export class ShowSeatsRepository { // implements IChatRepo
    async saveShowSeat (showSeat: IShowSeatToSave): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }
}