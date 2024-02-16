import { OTP } from "../../interfaces/genOTP";


export class GenerateOtp implements OTP {
    // To generate a four number otp
    generateOTP(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }
}