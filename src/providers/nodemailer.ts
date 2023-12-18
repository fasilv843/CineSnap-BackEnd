import { mailTransporter } from "../infrastructure/config/mailTransporter";
import { getOTPTemplate } from "../infrastructure/helperFunctions/getMailTemplate";
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
}