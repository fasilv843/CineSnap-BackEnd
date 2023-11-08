import { OTP } from "../interfaces/genOTP";


export class GenerateOtp implements OTP {
    generateOTP(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }
}