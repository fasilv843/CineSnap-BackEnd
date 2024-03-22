"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const jwtToken_1 = require("../utils/jwtToken");
const tokenRouter = express_1.default.Router();
const tokenGenerator = new jwtToken_1.TokenGenerator();
tokenRouter.get('/', (req, res) => {
    try {
        const refreshToken = req.headers.authorization;
        if (refreshToken) {
            const decoded = jsonwebtoken_1.default.verify(refreshToken.slice(7), process.env.JWT_SECRET_KEY);
            const accessToken = tokenGenerator.generateAccessToken(decoded.id);
            res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                status: httpStatusCodes_1.STATUS_CODES.OK,
                message: 'Success',
                accessToken
            });
        }
        else {
            res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized',
                accessToken: ''
            });
        }
    }
    catch (error) {
        console.log(error, 'error during generating access token');
        res.status(httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: error.message,
            accessToken: ''
        });
    }
});
exports.default = tokenRouter;
