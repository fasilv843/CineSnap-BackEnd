// import { ILocation } from "../schema/common"
import { ITheater } from "../schema/theaterSchema"


export interface ITheaterRepo {
    saveTheater(theater: ITheater): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: string): Promise<ITheater | null>
    // findByLocation(location: ILocation): Promise<ITheater | null>
    findAllTheaters(): Promise< ITheater[] | [] >
}