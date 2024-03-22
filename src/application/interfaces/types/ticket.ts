import { ColType, RowType, PaymentMethod } from "../../../entities/common";
import { ITempTicket } from "../../../entities/temp/tempTicket";
import { ITicket } from "../../../entities/ticket";
import { IApiRes } from "./common";

export interface ISelectedSeat {
    row: string
    col: number
}

export type SeatRes = {
    [Key in RowType]?: ColType[];
};

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