import { IShow } from "../../entities/show";
import { IShowToSave } from "../../interfaces/schema/showSchema";

export interface IShowRepo {
    saveShow (showTosave: IShowToSave): Promise<IShow>
}