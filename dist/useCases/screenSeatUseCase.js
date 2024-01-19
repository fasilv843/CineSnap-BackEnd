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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenSeatUseCase = void 0;
const httpStausCodes_1 = require("../constants/httpStausCodes");
const getScreenSeat_1 = require("../infrastructure/helperFunctions/getScreenSeat");
const response_1 = require("../infrastructure/helperFunctions/response");
class ScreenSeatUseCase {
    constructor(screenSeatRepository, screenRepository) {
        this.screenSeatRepository = screenSeatRepository;
        this.screenRepository = screenRepository;
    }
    findScreenSeatById(screenSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screenSeat = yield this.screenSeatRepository.findScreenSeatById(screenSeatId);
                if (screenSeat)
                    return (0, response_1.get200Response)(screenSeat);
                else
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Screen Id missing');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateScreenSeat(seatId, seatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seat = yield this.screenSeatRepository.updateScreenSeat(seatData);
                if (seat) {
                    const seatCount = (0, getScreenSeat_1.getSeatCount)(seatData);
                    const lastRow = (0, getScreenSeat_1.getLastRow)(seatData);
                    const screen = yield this.screenRepository.updateSeatCount(seat._id, seatCount, lastRow);
                    if (screen)
                        return (0, response_1.get200Response)(seat);
                    else
                        return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong');
                }
                else
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'seatId is invalid');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ScreenSeatUseCase = ScreenSeatUseCase;
