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
exports.ShowSeatsUseCase = void 0;
const console_1 = require("console");
const httpStausCodes_1 = require("../constants/httpStausCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
class ShowSeatsUseCase {
    constructor(showSeatRepository) {
        this.showSeatRepository = showSeatRepository;
    }
    findShowSeatById(showSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showSeats = yield this.showSeatRepository.findShowSeatById(showSeatId);
                (0, console_1.log)(showSeatId, 'showSeatId');
                if (showSeats) {
                    return (0, response_1.get200Response)(showSeats);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid show seat id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ShowSeatsUseCase = ShowSeatsUseCase;
