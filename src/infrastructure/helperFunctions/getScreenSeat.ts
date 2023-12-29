import { log } from "console";
import { ALPHABETS } from "../../constants/constants";
import { IScreenSeatSave, ISingleScreenSeatSave } from "../../interfaces/schema/screenSeatSchema";

function splitAlphabetsToThree (rows: string) {
    const index = ALPHABETS.indexOf(rows.toUpperCase());
    let diamondSeats = ''
    let goldSeats = ''
    let silverSeats = ''

    if (index >= 9) {
      diamondSeats += ALPHABETS.slice(0, 4);
      goldSeats += ALPHABETS.slice(4, 8);
      silverSeats += ALPHABETS.slice(8, index + 1);
    } else {
      const groupSize = Math.ceil(index / 3) + 1;
  
      diamondSeats += ALPHABETS.slice(0, groupSize);
      goldSeats += ALPHABETS.slice(groupSize, groupSize * 2);
      silverSeats += ALPHABETS.slice(groupSize * 2, index + 1);
    }

    return {
        diamondSeats,
        goldSeats,
        silverSeats
    }
}

function assignSeats <T>(seatAlphabets: string, rowArr: T[]): Map<string, T[]> {
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
    const rowArr:ISingleScreenSeatSave[] = Array.from({ length: cols }, (_, index) => ({ col: index + 1 }));

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