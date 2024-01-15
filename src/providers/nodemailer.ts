import { log } from "console";
import { mailTransporter } from "../infrastructure/config/mailTransporter";
import { generateInvoiceAndGetPath, getMovieSuccessMailTemplate, getOTPTemplate } from "../infrastructure/helperFunctions/getMailTemplate";
import { ITicketRes } from "../interfaces/schema/ticketSchema";
import { sendMail } from "../interfaces/sendMail";
import fs from 'fs'

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
        const mailTemplate = await getMovieSuccessMailTemplate(ticket)

        // Assuming you've generated the PDF and saved it on your server
        const pdfPath = await generateInvoiceAndGetPath(ticket)

        // Read the PDF file as a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "Movie Booking Success",
            html: mailTemplate,
            attachments: [
                {
                  filename: 'invoice.pdf', // Specify the desired filename for the attachment
                  content: pdfBuffer,
                  encoding: 'base64', // Use 'base64' encoding for binary data like PDFs
                  contentType: 'application/pdf', // Set the content type for the attachment
                },
            ]
        };

        mailTransporter.sendMail(details, ( err:Error | null ) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    async invoiceDownloadMail (email: string, ticket: ITicketRes): Promise<void> {
        const mailTemplate = await getMovieSuccessMailTemplate(ticket)

        // Assuming you've generated the PDF and saved it on your server
        const pdfPath = await generateInvoiceAndGetPath(ticket)

        // Read the PDF file as a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "Invoice",
            html: mailTemplate,
            attachments: [
                {
                  filename: 'invoice.pdf', // Specify the desired filename for the attachment
                  content: pdfBuffer,
                  encoding: 'base64', // Use 'base64' encoding for binary data like PDFs
                  contentType: 'application/pdf', // Set the content type for the attachment
                },
            ]
        };

        log('details added with attachment , sending mail')

        mailTransporter.sendMail(details, ( err:Error | null ) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
}