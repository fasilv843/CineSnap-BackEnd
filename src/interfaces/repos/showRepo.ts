import { IShowRequirements, IShowRes } from "../schema/showSchema";

export interface IShowRepo {
    saveShow(show: IShowRequirements): Promise<IShowRes>
}