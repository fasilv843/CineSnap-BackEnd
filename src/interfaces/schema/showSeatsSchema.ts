import { ID } from "../common"
import { IShowSingleSeat } from "./showSchema"


export interface IShowSeatCategory {
    name: string
    price: number
    seats: Map<string, IShowSingleSeat[]>
}

export interface IShowSeatCategoryRes extends Omit<IShowSeatCategory, 'seats'> {
    seats: Partial<Record<string, IShowSingleSeat[]>>
}

export interface IShowSeats {
    _id: ID
    diamond: IShowSeatCategory
    gold: IShowSeatCategory
    silver: IShowSeatCategory
}

export interface IShowSeatToSave extends Omit<IShowSeats, '_id'> {}

export interface IShowSeatsRes extends Omit<IShowSeats, 'diamond' | 'gold' | 'silver'> {
    diamond: IShowSeatCategoryRes
    gold: IShowSeatCategoryRes
    silver: IShowSeatCategoryRes
}