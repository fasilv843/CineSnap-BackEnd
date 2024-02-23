import { ITicketRes } from "../../interfaces/schema/ticketSchema";

export interface IMailSender {
    sendOTP(email: string, otp: number): void;
    sendBookingSuccessMail (email: string, ticket: ITicketRes): Promise<void>
    invoiceDownloadMail (email: string, ticket: ITicketRes): Promise<void>
}