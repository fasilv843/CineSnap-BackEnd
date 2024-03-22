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
exports.CouponRepository = void 0;
const couponModel_1 = require("../db/couponModel");
class CouponRepository {
    addCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new couponModel_1.couponModel(coupon).save();
        });
    }
    findCouponsOnTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield couponModel_1.couponModel.find({ theaterId });
        });
    }
    findCouponById(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield couponModel_1.couponModel.findById(couponId);
        });
    }
    updateCancelStatus(couponId, currCancelStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield couponModel_1.couponModel.findByIdAndUpdate({ _id: couponId }, {
                $set: { isCancelled: !currCancelStatus }
            });
        });
    }
    getAvailableCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            return yield couponModel_1.couponModel.find({
                isCancelled: false,
                couponCount: { $gte: 1 },
                $or: [
                    { couponType: { $ne: 'Once' } }, // Exclude 'Once' type from date checks
                    {
                        couponType: 'Once',
                        endDate: { $gte: currentDate },
                        startDate: { $lte: currentDate }
                    }
                ]
            });
        });
    }
}
exports.CouponRepository = CouponRepository;
