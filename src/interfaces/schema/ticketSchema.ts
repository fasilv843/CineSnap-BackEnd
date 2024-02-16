import { ColType, IApiRes, PaymentMethod, RowType } from "../common";

export interface ITicketSeat {
    seats: string[]
    name: string
    singlePrice: number
    CSFeePerTicket: number
    totalPrice: number
}

export interface ITicket {
    _id: string
    showId: string
    userId: string
    screenId: string
    movieId: string
    theaterId: string
    diamondSeats: ITicketSeat
    goldSeats: ITicketSeat
    silverSeats: ITicketSeat
    totalPrice: number
    seatCount: number
    startTime: Date
    endTime: Date
    isCancelled: boolean
    cancelledBy?: 'User' | 'Theater' | 'Admin'
    paymentMethod: 'Wallet' | 'Razorpay',
    couponId: string,
}

export interface ISelectedSeat {
    row: string
    col: number
}

export type SeatRes = {
    [Key in RowType]?: ColType[];
};

export interface ITempTicket extends Omit<ITicket, 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {
    expireAt: Date
}
export interface ISaveRequestReqs extends ITempTicket {
    paymentMethod: PaymentMethod
}
export interface ITempTicketRes extends ITempTicket {}
export interface IApiTempTicketRes extends IApiRes<ITempTicketRes | null> {}
export interface IApiTempTicketsRes extends IApiRes<ITempTicketRes[]> {}

export interface ITempTicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {}


export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' > {}

export interface ITicketRes extends ITicket {
    createdAt: Date
    updatedAt: Date
}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[] | null> {}

export type Seats = Map<string, number[]>[]
export interface IApiSeatsRes extends IApiRes<Seats | null> {}

export interface ITicketsAndCount {
    tickets: ITicketRes[]
    ticketCount: number
}