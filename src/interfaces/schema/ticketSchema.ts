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

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'endTime' | 'totalPrice'>  {}
export interface ITicketRes extends ITicket {}
export interface IApiTicketRes extends IApiRes<ITicketRes> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[]> {}