import { ColType, IApiRes, ID, RowType } from "../common";

export interface ITicketSeat {
    seats: string[]
    name: string
    singlePrice: number
    CSFeePerTicket: number
    totalPrice: number
}

export interface ITicket {
    _id: ID
    showId: ID
    userId: ID
    screenId: ID
    movieId: ID
    theaterId: ID
    diamondSeats: ITicketSeat
    goldSeats: ITicketSeat
    silverSeats: ITicketSeat
    totalPrice: number
    seatCount: number
    startTime: Date
    endTime: Date
    isCancelled: boolean
    cancelledBy?: 'User' | 'Theater' | 'Admin'
    paymentMethod: 'Wallet' | 'Razorpay'
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

export interface ITempTicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {}


export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' > {}

export interface ITicketRes extends ITicket {}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[] | null> {}

export type Seats = Map<string, number[]>[]
export interface IApiSeatsRes extends IApiRes<Seats | null> {}

export interface ITicketsAndCount {
    tickets: ITicketRes[]
    ticketCount: number
}