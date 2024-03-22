import { ICouponReqs, ICouponRes } from "../types/coupon";

export interface ICouponRepo {
    addCoupon (coupon: ICouponReqs): Promise<ICouponRes>
    findCouponsOnTheater (theaterId: string): Promise<ICouponRes[]>
    findCouponById (couponId: string): Promise<ICouponRes | null>
    updateCancelStatus (couponId: string, currCancelStatus: boolean): Promise<ICouponRes | null>
    getAvailableCoupons (): Promise<ICouponRes[]>
}