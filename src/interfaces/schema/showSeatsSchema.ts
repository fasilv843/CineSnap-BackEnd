import { ID } from "../common"
import { IShowSingleSeat } from "./showSchema"


export interface IShowSeatCategory {
    name: string
    price: number
    seats: Map<string, IShowSingleSeat[]>
}

export interface IShowSeats {
    _id: ID
    diamond: IShowSeatCategory
    gold: IShowSeatCategory
    silver: IShowSeatCategory
}