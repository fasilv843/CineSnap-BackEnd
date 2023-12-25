import { ColType, IApiRes, ID, RowType } from "../common";

export interface ITicket {
    _id: ID
    showId: ID
    userId: ID
    screenId: ID
    movieId: ID
    theaterId: ID
    singlePrice: number
    feePerTicket: number
    totalPrice: number
    seatCount: number
    seats: Map<string, Array<number>>
    startTime: Date
    endTime: Date
    isCancelled: boolean
    paymentMethod: 'Wallet' | 'Stripe'
}

export interface ISelectedSeat {
    row: string
    col: number
}

export type SeatRes = {
    [Key in RowType]?: ColType[];
};

export interface ITempTicket extends Omit<ITicket, 'isCancelled'> {
    expireAt: Date
}
export interface ITempTicketRes extends ITempTicket {}
export interface IApiTempTicketRes extends IApiRes<ITempTicketRes | null> {}
export interface IApiTempTicketsRes extends IApiRes<ITempTicketRes[]> {}

export interface ITempTicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'seats'> {
    seats: ISelectedSeat[]
}

export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' > {}

export interface ITicketRes extends Omit<ITicket, 'seats'> {
    seats: SeatRes
}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[] | null> {}

export type Seats = Map<string, number[]>[]
export interface IApiSeatsRes extends IApiRes<Seats | null> {}