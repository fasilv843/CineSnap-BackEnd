"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminRepository_1 = require("../repositories/adminRepository");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const adminRepository = new adminRepository_1.AdminRepository();
const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token.slice(7), process.env.JWT_SECRET_KEY);
                const adminData = yield adminRepository.findById(decoded.id);
                if (adminData !== null) {
                    next();
                }
                else {
                    res.status(UNAUTHORIZED).json({ message: 'Not authorized, invalid token' });
                }
            }
            catch (verifyError) {
                console.error('JWT Verification Error:', verifyError);
                res.status(UNAUTHORIZED).json({ message: 'Not authorized, invalid token' });
            }
        }
        else {
            res.status(UNAUTHORIZED).json({ message: 'Token not available' });
        }
    }
    catch (error) {
        console.error('Unexpected Error:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
});
exports.adminAuth = adminAuth;
