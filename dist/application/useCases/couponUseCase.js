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
exports.CouponUseCase = void 0;
const console_1 = require("console");
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const response_1 = require("../../infrastructure/helperFunctions/response");
const getUnusedCoupons_1 = require("../../infrastructure/helperFunctions/getUnusedCoupons");
class CouponUseCase {
    constructor(_couponRepository, _theaterRepository, _tempTicketRepository, _userRepository) {
        this._couponRepository = _couponRepository;
        this._theaterRepository = _theaterRepository;
        this._tempTicketRepository = _tempTicketRepository;
        this._userRepository = _userRepository;
    }
    addCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(coupon, 'coupon');
                if (coupon.discountType === 'Percentage' && coupon.maxDiscountAmt === undefined) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Add a limit to discount if discount type is percentage');
                }
                const theater = yield this._theaterRepository.findById(coupon.theaterId);
                if (theater) {
                    const savedCoupon = yield this._couponRepository.addCoupon(coupon);
                    return (0, response_1.get200Response)(savedCoupon);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getCouponsOnTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theater = yield this._theaterRepository.findById(theaterId);
                if (theater === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
                const coupons = yield this._couponRepository.findCouponsOnTheater(theaterId);
                if (coupons.length > 0) {
                    return (0, response_1.get200Response)(coupons);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Coupons not available');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    cancelCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield this._couponRepository.findCouponById(couponId);
                if (coupon === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid coupon id');
                const updatedCoupon = yield this._couponRepository.updateCancelStatus(couponId, coupon.isCancelled);
                if (updatedCoupon)
                    return (0, response_1.get200Response)(updatedCoupon);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid coupon id');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getApplicableCoupons(userId, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const availCoupons = yield this._couponRepository.getAvailableCoupons();
                if (availCoupons.length) {
                    const ticket = yield this._tempTicketRepository.findTempTicketById(ticketId);
                    if (ticket === null)
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'invalid Ticket id');
                    const filteredCoupons = availCoupons.filter(coupon => coupon.minTicketCount <= ticket.seatCount);
                    if (filteredCoupons.length === 0)
                        return (0, response_1.get200Response)(filteredCoupons); // returning empty array, after filtering
                    const userCoupons = yield this._userRepository.findUserCoupons(userId);
                    if (!userCoupons)
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
                    const unusedCoupons = (0, getUnusedCoupons_1.filterUnusedCoupons)(filteredCoupons, userCoupons.usedCoupons);
                    return (0, response_1.get200Response)(unusedCoupons);
                }
                else {
                    return (0, response_1.get200Response)(availCoupons); // returning empty array as response
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.CouponUseCase = CouponUseCase;
