import { mailTransporter } from "../infrastructure/config/mailTransporter";
import { getMovieSuccessMailTemplate, getOTPTemplate } from "../infrastructure/helperFunctions/getMailTemplate";
import { ITicketRes } from "../interfaces/schema/ticketSchema";
import { sendMail } from "../interfaces/sendMail";


export class MailSender implements sendMail {
    sendOTP(email: string, otp: number): void {
        const template = getOTPTemplate(otp)

        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "CineSnap Verification",
            html: template
        };

        mailTransporter.sendMail(details, ( err:Error | null ) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    async sendBookingSuccessMail (email: string, ticket: ITicketRes): Promise<void> {
        const template = await getMovieSuccessMailTemplate(ticket)

        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "Movie Booking Success",
            html: template
        };

        mailTransporter.sendMail(details, ( err:Error | null ) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
}