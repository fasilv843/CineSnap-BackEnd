"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const cors_1 = __importDefault(require("cors"));
const adminRoute_1 = __importDefault(require("../routes/adminRoute"));
const theatreRoute_1 = __importDefault(require("../routes/theatreRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const tokenRoute_1 = __importDefault(require("../routes/tokenRoute"));
const path_1 = __importDefault(require("path"));
const console_1 = require("console");
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        (0, console_1.log)(process.env.CORS_URI, 'cors url from .env.NODE_ENV');
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../../../images')));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            credentials: true,
            origin: process.env.CORS_URI
        }));
        app.use('/api/admin', adminRoute_1.default);
        app.use('/api/theater', theatreRoute_1.default);
        app.use('/api/user', userRoute_1.default);
        app.use('/api/token', tokenRoute_1.default);
        return app;
    }
    catch (error) {
        console.log('error logging from createServer, from app.ts');
        console.error('error caught from app');
        console.log(error.message);
    }
};
exports.createServer = createServer;
