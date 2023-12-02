// import { ILocation } from "../schema/common"
import { ID } from "../common"
import { ITempTheaterRes } from "../schema/tempTheaterSchema"
import { ITheater } from "../schema/theaterSchema"


export interface ITheaterRepo {
    saveTheater(theater: ITempTheaterRes): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: ID): Promise<ITheater | null>
    // findByLocation(location: ILocation): Promise<ITheater | null>
    findAllTheaters(): Promise< ITheater[] | [] >
    getNearestTheaters(lon:number, lat: number, radius: number): Promise< ITheater[] | [] >
    getNearestTheatersByLimit(lon:number, lat: number, limit: number, maxDistance: number): Promise< ITheater[] | [] >
}