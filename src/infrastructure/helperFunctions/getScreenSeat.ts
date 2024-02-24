import { log } from "console";
import { ALPHABETS } from "../constants/constants";
import { IScreenSeatRes, IScreenSeatSave } from "../../application/interfaces/types/screenSeat";
import { ColType } from "../../entities/common";
import { IScreenSeatCategory } from "../../entities/screenSeat";

function splitAlphabetsToThree (rows: string) {
    const index = ALPHABETS.indexOf(rows.toUpperCase());
    const availRows = ALPHABETS.slice(0, index + 1)
    let diamondSeats = ''
    let goldSeats = ''
    let silverSeats = ''

    diamondSeats += availRows.slice(0, 4);
    goldSeats += availRows.slice(4, 8);
    if (index >= 8) silverSeats += availRows.slice(8, index + 1);
    
    return {
        diamondSeats,
        goldSeats,
        silverSeats
    }
}

function assignSeats <T>(seatAlphabets: string, rowArr: T): Map<string, T> {
    const seatMap = new Map()
    for (let i=0; i<seatAlphabets.length; i++) {
        seatMap.set(seatAlphabets[i], rowArr)
    }
    return seatMap
}

export function getDefaultScreenSeatSetup(rows: string, cols: number): IScreenSeatSave {
    const seats = splitAlphabetsToThree(rows)
    const { diamondSeats, goldSeats, silverSeats } = seats

    // Populate an array with objects from { col: 1 } to { col: cols }
    const rowArr: ColType[] = Array.from({ length: cols }, (_, index) => index + 1 ) as ColType[]

    log(rowArr, 'default rowArr for assingning to seats')
    const diamondSeatMap = assignSeats(diamondSeats, rowArr)
    const goldSeatMap = assignSeats(goldSeats, rowArr)
    const silverSeatMap = assignSeats(silverSeats, rowArr)

    log(diamondSeatMap, goldSeatMap, silverSeatMap, 'seat maps from get default seats setup')

    return {
        diamond: { seats: diamondSeatMap },
        gold: { seats: goldSeatMap },
        silver: { seats: silverSeatMap }
    }
}

export function getCategorySeatCount (cat: IScreenSeatCategory): number {
    let seatCout = 0
    for (const row of Object.values(cat.seats)) {
        seatCout += row.filter((x: number) => x !== 0).length
    }
    return seatCout
}

export function getSeatCount(screenSeat: IScreenSeatRes): number {
    return (
        getCategorySeatCount(screenSeat.diamond) +
        getCategorySeatCount(screenSeat.gold) + 
        getCategorySeatCount(screenSeat.silver)
    )
}

export function getRowKeys (category: IScreenSeatCategory): string[] {
    return Object.keys(category.seats)
}


export function getLastRow (screenSeat: IScreenSeatRes): string {
    const diamondKeys = getRowKeys(screenSeat.diamond)
    const goldKeys = getRowKeys(screenSeat.gold)
    const silverKeys = getRowKeys(screenSeat.silver)

    if (silverKeys.length !== 0) {
      return silverKeys[silverKeys.length - 1]
    } else if (goldKeys.length !== 0) {
      return goldKeys[goldKeys.length - 1]
    } else {
      return diamondKeys[diamondKeys.length - 1]
    }
}

export function getAvailSeatData(cat: IScreenSeatCategory): string | undefined {
    log(cat, 'cat from getAvailSeatData')
    if (cat.seats.size > 0) {
        log('returning name', cat.name)
        return cat.name
    } else {
        log('returning undefined')
        return undefined
    }
}