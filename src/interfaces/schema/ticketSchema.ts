import { IApiRes, ID } from "../common";

export interface ITicket {
    _id: ID
    showId: ID
    userId: ID
    screenId: ID
    movieId: ID
    theaterId: ID
    singlePrice: number
    totalPrice: number
    seatCount: number
    seats: Map<string, Array<number>>
    startTime: Date
    endTime: Date
    isCancelled: boolean
    // status: string
}

export interface ISelectedSeat {
    row: string
    col: number
}

export interface ITempTicket extends Omit<ITicket, 'isCancelled'> {
    expireAt: Date
}
export interface ITempTicketRes extends ITempTicket {}
export interface IApiTempTicketRes extends IApiRes<ITempTicketRes | null> {}
export interface IApiTempTicketsRes extends IApiRes<ITempTicketRes[]> {}

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'seats'> {
    seats: ISelectedSeat[]
}
export interface ITicketRes extends ITicket {}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[]> {}

export type Seats = Map<string, number[]>[]
export interface IApiSeatsRes extends IApiRes<Seats | null> {}