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
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const httpStausCodes_1 = require("../../constants/httpStausCodes");
const userRepository = new userRepository_1.UserRepository();
const { FORBIDDEN, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = httpStausCodes_1.STATUS_CODES;
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token.slice(7), process.env.JWT_SECRET_KEY);
            const userData = yield userRepository.findById(decoded.id);
            if (userData !== null) {
                // req.userId = userData?._id
                if (userData.isBlocked) {
                    res.status(FORBIDDEN).json({ message: 'You are blocked' });
                }
                else {
                    next();
                }
            }
            else {
                res.status(UNAUTHORIZED).json({ message: 'Not authorized, invalid token' });
            }
        }
        else {
            res.status(UNAUTHORIZED).json({ message: 'Token not available' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Not authorized, invalid token' });
    }
});
exports.userAuth = userAuth;
