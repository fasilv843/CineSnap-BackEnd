export interface IMailSender {
    sendOTP(email: string, otp: number) :void;
}