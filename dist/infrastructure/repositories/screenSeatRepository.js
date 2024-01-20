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
exports.ScreenSeatRepository = void 0;
const screenSeatModel_1 = require("../../entities/models/screenSeatModel");
class ScreenSeatRepository {
    saveScreenSeat(screenSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new screenSeatModel_1.screenSeatModel(screenSeat).save();
        });
    }
    findScreenSeatById(screenSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screenSeatModel_1.screenSeatModel.findById(screenSeatId);
        });
    }
    updateScreenSeat(screenSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screenSeatModel_1.screenSeatModel.findByIdAndUpdate({ _id: screenSeat._id }, {
                $set: {
                    diamond: screenSeat.diamond,
                    gold: screenSeat.gold,
                    silver: screenSeat.silver
                }
            });
        });
    }
    deleteScreenSeat(seatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screenSeatModel_1.screenSeatModel.findByIdAndDelete(seatId);
        });
    }
}
exports.ScreenSeatRepository = ScreenSeatRepository;
