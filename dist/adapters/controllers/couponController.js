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
exports.CouponController = void 0;
class CouponController {
    constructor(couponUseCase) {
        this.couponUseCase = couponUseCase;
    }
    addCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = req.body.coupon;
            const couponRes = yield this.couponUseCase.addCoupon(coupon);
            res.status(couponRes.status).json(couponRes);
        });
    }
    getCouponsOnTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const couponRes = yield this.couponUseCase.getCouponsOnTheater(theaterId);
            res.status(couponRes.status).json(couponRes);
        });
    }
    cancelCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponId = req.params.couponId;
            const couponRes = yield this.couponUseCase.cancelCoupon(couponId);
            res.status(couponRes.status).json(couponRes);
        });
    }
    getApplicableCoupons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const ticketId = req.query.ticketId;
            const couponRes = yield this.couponUseCase.getApplicableCoupons(userId, ticketId);
            res.status(couponRes.status).json(couponRes);
        });
    }
}
exports.CouponController = CouponController;
