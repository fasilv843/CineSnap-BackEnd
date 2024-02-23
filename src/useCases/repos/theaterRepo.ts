import { ITheater } from "../../entities/theater"
import { ITempTheaterRes } from "../../interfaces/schema/tempTheaterSchema"
import { ITheaterRes } from "../../interfaces/schema/theaterSchema"


export interface ITheaterRepo {
    saveTheater(theater: ITempTheaterRes): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: string): Promise<ITheater | null>
    findAllTheaters(page: number, limit: number, searchQuery: string): Promise<ITheaterRes[]>
    getNearestTheaters(lon:number, lat: number, radius: number): Promise< ITheater[]>
    getNearestTheatersByLimit(lon:number, lat: number, limit: number, maxDistance: number): Promise< ITheater[]>
}