"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPGenerator = void 0;
class OTPGenerator {
    // To generate a four number otp
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }
}
exports.OTPGenerator = OTPGenerator;
