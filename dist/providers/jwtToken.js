"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants/constants");
class JWTToken {
    // To generate access tokne
    generateAccessToken(id) {
        const KEY = process.env.JWT_SECRET_KEY;
        if (KEY !== undefined) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.accessTokenExp;
            return jsonwebtoken_1.default.sign({ id, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error('JWT Key is not defined');
    }
    // To generate a refresh token
    generateRefreshToken(id) {
        const KEY = process.env.JWT_SECRET_KEY;
        if (KEY !== undefined) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.refreshTokenExp;
            return jsonwebtoken_1.default.sign({ id, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error('JWT Key is not defined');
    }
    // To generate a temporary token for authentication
    generateTempToken(id) {
        const KEY = process.env.JWT_SECRET_KEY;
        if (KEY !== undefined) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.tempTokenExp;
            return jsonwebtoken_1.default.sign({ id, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error('JWT Key is not defined');
    }
}
exports.JWTToken = JWTToken;
