"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const console_1 = require("console");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
(0, console_1.log)('reached into multer');
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        (0, console_1.log)('multer is working ....!!');
        (0, console_1.log)(path_1.default.join(__dirname, '../../../images'), 'directory from path');
        cb(null, path_1.default.join(__dirname, '../../../images'));
    },
    filename: (_req, file, cb) => {
        const name = Date.now().toString() + '-' + file.originalname.split(' ').join('-');
        (0, console_1.log)(name, 'image name');
        cb(null, name);
    },
});
exports.upload = (0, multer_1.default)({ storage });
