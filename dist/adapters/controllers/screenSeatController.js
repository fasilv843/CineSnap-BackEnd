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
exports.ScreenSeatController = void 0;
class ScreenSeatController {
    constructor(screenSeatUseCase) {
        this.screenSeatUseCase = screenSeatUseCase;
    }
    findScreenSeatById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenSeatId = req.params.seatId;
            const screenSeatRes = yield this.screenSeatUseCase.findScreenSeatById(screenSeatId);
            res.status(screenSeatRes.status).json(screenSeatRes);
        });
    }
    updateScreenSeat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenSeatId = req.params.seatId;
            const { screenSeatData } = req.body;
            const screenSeatRes = yield this.screenSeatUseCase.updateScreenSeat(screenSeatId, screenSeatData);
            res.status(screenSeatRes.status).json(screenSeatRes);
        });
    }
}
exports.ScreenSeatController = ScreenSeatController;
