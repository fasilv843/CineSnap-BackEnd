"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOtp = void 0;
class GenerateOtp {
    // To generate a four number otp
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }
}
exports.GenerateOtp = GenerateOtp;
