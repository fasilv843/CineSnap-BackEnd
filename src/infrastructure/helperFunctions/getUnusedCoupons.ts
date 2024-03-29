import { log } from "console";
import { ICouponRes } from "../../application/interfaces/types/coupon";
import { getCurrentWeekPeriod, isDateInBetween, getCurrentMonthPeriod, getCurrentYearPeriod } from "./getPeriods";
import { IUsedCoupons } from "../../entities/user";

export function filterUnusedCoupons(coupons: ICouponRes[], usedCoupons: IUsedCoupons[]): ICouponRes[] {
    log(usedCoupons, 'used Coupons from filterUnused Coupons')
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