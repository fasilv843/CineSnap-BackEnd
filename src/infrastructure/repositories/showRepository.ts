import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IShowRequirements, IShowRes } from "../../interfaces/schema/showSchema";




export class ShowRepository implements IShowRepo {
    saveShow(show: IShowRequirements): Promise<IShowRes> {
        console.log(show);
        throw new Error("Method not implemented.");
    }
}