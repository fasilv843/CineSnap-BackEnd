import { IShow, IShowToSave } from "../../interfaces/schema/showSchema";

export interface IShowRepo {
    saveShow (showTosave: IShowToSave): Promise<IShow>
}