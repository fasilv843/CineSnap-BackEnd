"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUnusedCoupons = void 0;
const console_1 = require("console");
const getPeriods_1 = require("./getPeriods");
function filterUnusedCoupons(coupons, usedCoupons) {
    (0, console_1.log)(usedCoupons, 'used Coupons from filterUnused Coupons');
    if (usedCoupons.length === 0)
        return coupons;
    return coupons.filter(coupon => {
        const usedCoupon = usedCoupons.find(usedCopn => usedCopn.couponId === coupon._id);
        if (usedCoupon === undefined)
            return true;
        if (coupon.couponType === 'Once') {
            return usedCoupon === undefined; // false, we already checked it and returned true
        }
        else if (coupon.couponType === 'Weekly') {
            const { weekStart, weekEnd } = (0, getPeriods_1.getCurrentWeekPeriod)(coupon.startDate);
            return (0, getPeriods_1.isDateInBetween)(new Date(), weekStart, weekEnd);
        }
        else if (coupon.couponType === 'Monthly') {
            const { monthStart, monthEnd } = (0, getPeriods_1.getCurrentMonthPeriod)(coupon.startDate);
            return (0, getPeriods_1.isDateInBetween)(new Date(), monthStart, monthEnd);
        }
        else if (coupon.couponType === 'Yearly') {
            const { yearStart, yearEnd } = (0, getPeriods_1.getCurrentYearPeriod)(coupon.startDate);
            return (0, getPeriods_1.isDateInBetween)(new Date(), yearStart, yearEnd);
        }
    });
}
exports.filterUnusedCoupons = filterUnusedCoupons;
