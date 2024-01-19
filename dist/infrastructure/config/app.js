"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const adminRoute_1 = __importDefault(require("../routes/adminRoute"));
const theatreRoute_1 = __importDefault(require("../routes/theatreRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const tokenRoute_1 = __importDefault(require("../routes/tokenRoute"));
const path_1 = __importDefault(require("path"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
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
