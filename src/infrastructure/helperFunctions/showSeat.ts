import { DEF_DIAMOND_PRICE, DEF_GOLD_PRICE, DEF_SILVER_PRICE } from "../../constants/constants";
import { IScreenSeatCategory, IScreenSeatRes } from "../../interfaces/schema/screenSeatSchema";
import { IShowSingleSeat } from "../../interfaces/schema/showSchema";
import { IShowSeatCategory, IShowSeats } from "../../interfaces/schema/showSeatsSchema";

export function getShowSeatCategory (screenCat: IScreenSeatCategory, price: number): IShowSeatCategory {
    const showSeatMap: Map<string, IShowSingleSeat[]> = new Map()
    for (const [rowName, row] of screenCat.seats) {
        const showSeatRow: IShowSingleSeat[] = row.map(x => ({ col: x, isBooked: false }))
        showSeatMap.set(rowName, showSeatRow)
    }

    return {
        name: screenCat.name,
        price,
        seats: showSeatMap
    }
}

export function createEmptyShowSeat (screenSeat: IScreenSeatRes): Omit<IShowSeats, '_id'> {
    return {
        diamond: getShowSeatCategory(screenSeat.diamond, DEF_DIAMOND_PRICE),
        gold: getShowSeatCategory(screenSeat.gold, DEF_GOLD_PRICE),
        silver: getShowSeatCategory(screenSeat.silver, DEF_SILVER_PRICE)
    }
}