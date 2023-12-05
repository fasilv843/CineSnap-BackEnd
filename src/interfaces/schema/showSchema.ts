import { ID } from "../common"

export interface IShowSeat {
    col: number
    isBooked: boolean
}

export interface IShow {
    _id: ID
    movieId: ID
    screenId: ID
    startTime: Date
    endTime: Date
    ticketPrice: number
    totalSeatCount: number
    availableSeatCount: number
    seats: Map<string, Array<IShowSeat>>
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seats'> {}

export interface IShowRes extends IShow {}