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
exports.TempUserRepository = void 0;
const tempUserModel_1 = require("../../entities/models/temp/tempUserModel");
class TempUserRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findOneAndUpdate({ email: user.email }, {
                $set: {
                    name: user.name,
                    email: user.email,
                    otp: user.otp,
                    password: user.password,
                    expireAt: Date.now()
                }
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findById({ _id: id });
        });
    }
    unsetOtp(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempUserModel_1.tempUserModel.findByIdAndUpdate({ _id: id, email }, { $unset: { otp: 1 } }, { new: true } // This option returns the modified document
            );
        });
    }
    updateOTP(id, email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            return tempUserModel_1.tempUserModel.findOneAndUpdate({ _id: id, email }, {
                $set: { otp: OTP }
            }, { new: true });
        });
    }
}
exports.TempUserRepository = TempUserRepository;
