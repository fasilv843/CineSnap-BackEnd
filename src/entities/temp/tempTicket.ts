import { ITicket } from "../ticket";

export interface ITempTicket extends Omit<ITicket, 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {
    expireAt: Date
}