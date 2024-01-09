import { ICouponRes } from "../../interfaces/schema/couponSchema";
import { IUsedCoupons } from "../../interfaces/schema/userSchema";
import { getCurrentWeekPeriod, isDateInBetween, getCurrentMonthPeriod, getCurrentYearPeriod } from "./getPeriods";

export function filterUnusedCoupons(coupons: ICouponRes[], usedCoupons: IUsedCoupons[]): ICouponRes[] {
    if (usedCoupons.length === 0) return coupons
    return coupons.filter(coupon => {
        const usedCoupon = usedCoupons.find(usedCopn => usedCopn.couponId === coupon._id)
        if (usedCoupon === undefined) return true
        if (coupon.couponType === 'Once') {
            return usedCoupon === undefined // false, we already checked it and returned true
        } else if (coupon.couponType === 'Weekly') {
            const { weekStart, weekEnd } = getCurrentWeekPeriod(coupon.startDate)
            return isDateInBetween(new Date(), weekStart, weekEnd)
        } else if (coupon.couponType === 'Monthly') {
            const { monthStart, monthEnd } = getCurrentMonthPeriod(coupon.startDate)
            return isDateInBetween(new Date(), monthStart, monthEnd)
        } else if (coupon.couponType === 'Yearly') {
            const { yearStart, yearEnd } = getCurrentYearPeriod(coupon.startDate)
            return isDateInBetween(new Date(), yearStart, yearEnd)
        }
    })
}