import { IApiRes, ID } from "../common"
import { IMovie } from "./movieSchema"

export interface IShowSingleSeat {
    col: number
    isBooked: boolean
}

export interface IShow {
    _id: ID
    movieId: ID
    screenId: ID
    startTime: Date
    endTime: Date
    // ticketPrice: number
    totalSeatCount: number
    availableSeatCount: number
    seatId: ID
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seats'> {}

export interface IShowUpdate extends Omit<IShowRequirements, 'seats'> {}

export interface IShowRes {
    movieId: IMovie
    shows: Array<Omit<IShow, 'seats'>>
}

export interface IApiShowsRes {
    status: number
    message: string
    data: IShowsOnAScreen[] | null
}

export interface IApiShowRes extends IApiRes<IShow | null> { }

export interface IShowsOnAScreen {
    screenId: ID,
    screenName: string
    shows: IShowRes[]
}