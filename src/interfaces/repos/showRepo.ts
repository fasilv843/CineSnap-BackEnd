import { IShow, IShowToSave } from "../schema/showSchema";

export interface IShowRepo {
    saveShow (showTosave: IShowToSave): Promise<IShow>
}