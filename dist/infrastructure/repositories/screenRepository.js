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
exports.ScreenRepository = void 0;
const screensModel_1 = require("../../entities/models/screensModel");
class ScreenRepository {
    saveScreen(screenData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new screensModel_1.screenModel(screenData).save();
        });
    }
    findScreenById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screensModel_1.screenModel.findById({ _id: id });
        });
    }
    findScreensInTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screensModel_1.screenModel.find({ theaterId });
        });
    }
    updateScreenName(screenId, screenName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screensModel_1.screenModel.findByIdAndUpdate({ _id: screenId }, {
                $set: { name: screenName }
            }, { new: true });
        });
    }
    deleteScreen(screenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screensModel_1.screenModel.findByIdAndDelete(screenId);
        });
    }
    updateSeatCount(seatId, seatsCount, rows) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield screensModel_1.screenModel.findOneAndUpdate({ seatId }, {
                $set: { seatsCount, rows }
            }, { new: true });
        });
    }
}
exports.ScreenRepository = ScreenRepository;
