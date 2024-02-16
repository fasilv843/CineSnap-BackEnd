import { ColType, IApiRes } from "../common"
import { IMovie } from "./movieSchema"

export interface IShowSingleSeat {
    col: ColType
    isBooked: boolean
}

export interface IShow {
    _id: string
    movieId: string
    screenId: string
    startTime: Date
    endTime: Date
    totalSeatCount: number
    availableSeatCount: number
    seatId: string
}

export interface IShowToSave extends Omit<IShow, '_id'> {}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seatId'> {
    diamondPrice: number
    goldPrice?: number
    silverPrice?: number
}

export interface IShowUpdate extends Omit<IShowRequirements, 'seatId'> {}

export interface IShowRes {
    movieId: IMovie
    shows: Array<Omit<IShow, 'seatId'>>
}

export interface IApiShowsRes {
    status: number
    message: string
    data: IShowsOnAScreen[] | null
}

export interface IApiShowRes extends IApiRes<IShow | null> { }

export interface IShowsOnAScreen {
    screenId: string,
    screenName: string
    shows: IShowRes[]
}