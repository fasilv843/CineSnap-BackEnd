import { IShowSeatCategory, IShowSeats } from "../../entities/showSeat"

export interface IShowSeatCategoryRes extends IShowSeatCategory {
    // seats: Partial<Record<string, IShowSingleSeat[]>>
}

export interface IShowSeatToSave extends Omit<IShowSeats, '_id'> {}

export interface IShowSeatsRes extends Omit<IShowSeats, 'diamond' | 'gold' | 'silver'> {
    diamond: IShowSeatCategoryRes
    gold: IShowSeatCategoryRes
    silver: IShowSeatCategoryRes
}