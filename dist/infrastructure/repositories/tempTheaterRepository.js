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
exports.TempTheaterRepository = void 0;
const tempTheaterModel_1 = require("../db/temp/tempTheaterModel");
class TempTheaterRepository {
    saveTheater(theater) {
        return __awaiter(this, void 0, void 0, function* () {
            return tempTheaterModel_1.tempTheaterModel.findOneAndUpdate({ email: theater.email }, {
                $set: {
                    name: theater.name,
                    email: theater.email,
                    otp: theater.otp,
                    liscenceId: theater.liscenceId,
                    coords: theater.coords,
                    address: theater.address,
                    password: theater.password,
                    expireAt: Date.now()
                }
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
        });
    }
    unsetTheaterOTP(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTheaterModel_1.tempTheaterModel.findByIdAndUpdate({ _id: id, email }, { $unset: { otp: 1 } }, { new: true });
        });
    }
    findTempTheaterById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTheaterModel_1.tempTheaterModel.findById({ _id: id });
        });
    }
    updateTheaterOTP(id, email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            return tempTheaterModel_1.tempTheaterModel.findOneAndUpdate({ _id: id, email }, {
                $set: { otp: OTP }
            }, { new: true });
        });
    }
}
exports.TempTheaterRepository = TempTheaterRepository;
