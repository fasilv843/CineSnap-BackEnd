"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEF_SILVER_PRICE = exports.DEF_GOLD_PRICE = exports.DEF_DIAMOND_PRICE = exports.ChargePerTicket = exports.passwordRegex = exports.nameRegex = exports.userNameMaxLength = exports.userNameMinLength = exports.ZipRegex = exports.OTPRegex = exports.passwordMinLength = exports.emailRegex = exports.ALPHABETS = exports.NoRefundTime = exports.QuarterRefundTime = exports.HalfRefundTime = exports.ThreeQuarterRefundTime = exports.tempTokenExp = exports.refreshTokenExp = exports.accessTokenExp = exports.maxDistance = exports.TheaterShowLimit = exports.OTP_TIMER = void 0;
exports.OTP_TIMER = 1000 * 60 * 3;
exports.TheaterShowLimit = 6;
exports.maxDistance = 100; // users can see theaters in 100 km radius
exports.accessTokenExp = 3 * 60 * 60; // 3 hour
exports.refreshTokenExp = 24 * 60 * 60; // 24 hour
exports.tempTokenExp = 10 * 60; // 10 min
// Time is in hours
exports.ThreeQuarterRefundTime = 48;
exports.HalfRefundTime = 24;
exports.QuarterRefundTime = 8;
exports.NoRefundTime = 4;
exports.ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
exports.passwordMinLength = 8;
exports.OTPRegex = '^[1-9][0-9]{3}$';
exports.ZipRegex = '^[1-9][0-9]{5}$';
exports.userNameMinLength = 3;
exports.userNameMaxLength = 20;
exports.nameRegex = '^[a-zA-Z ]{3,20}$';
exports.passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$';
exports.ChargePerTicket = 10; // Rupees
exports.DEF_DIAMOND_PRICE = 300;
exports.DEF_GOLD_PRICE = 250;
exports.DEF_SILVER_PRICE = 150;
