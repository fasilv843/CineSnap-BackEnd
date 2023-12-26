// import { ILocation } from "../schema/common"
import { ID } from "../common"
import { ITempTheaterRes } from "../schema/tempTheaterSchema"
import { ITheater, ITheaterRes } from "../schema/theaterSchema"


export interface ITheaterRepo {
    saveTheater(theater: ITempTheaterRes): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: ID): Promise<ITheater | null>
    findAllTheaters(page: number, limit: number, searchQuery: string): Promise<ITheaterRes[]>
    getNearestTheaters(lon:number, lat: number, radius: number): Promise< ITheater[] | [] >
    getNearestTheatersByLimit(lon:number, lat: number, limit: number, maxDistance: number): Promise< ITheater[] | [] >
}