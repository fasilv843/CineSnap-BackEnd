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
exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const movieModel_1 = require("../db/movieModel");
const theaterModel_1 = require("../db/theaterModel");
const tempUserModel_1 = require("../db/temp/tempUserModel");
const mongoConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (MONGO_URI) {
            yield mongoose_1.default.connect(MONGO_URI);
            yield movieModel_1.movieModel.createIndexes();
            yield theaterModel_1.theaterModel.createIndexes();
            yield tempUserModel_1.tempUserModel.createIndexes();
            console.log(`MongoDB connected: ${mongoose_1.default.connection.host}`);
        }
    }
    catch (error) {
        const err = error;
        console.log(`Error is ${err.message}`);
        process.exit(1);
    }
});
exports.mongoConnect = mongoConnect;
