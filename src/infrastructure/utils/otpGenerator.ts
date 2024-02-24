import { IOTPGenerator } from "../../application/interfaces/utils/otpGenerator";


export class OTPGenerator implements IOTPGenerator {
    // To generate a four number otp
    generateOTP(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }
}