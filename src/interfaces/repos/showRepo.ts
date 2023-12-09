import { IShow, IShowRequirements } from "../schema/showSchema";

export interface IShowRepo {
    saveShow(show: IShowRequirements): Promise<IShow>
}