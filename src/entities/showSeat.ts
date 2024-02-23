import { ColType, RowType } from "./common"

export interface IShowSingleSeat {
    col: ColType
    isBooked: boolean
}

export interface IShowSeatCategory {
    name: string
    price: number
    seats: Map<RowType, IShowSingleSeat[]>
}

export interface IShowSeats {
    _id: string
    diamond: IShowSeatCategory
    gold: IShowSeatCategory
    silver: IShowSeatCategory
}