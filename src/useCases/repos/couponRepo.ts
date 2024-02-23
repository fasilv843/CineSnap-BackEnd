import { ICouponReqs, ICouponRes } from "../../interfaces/schema/couponSchema";

export interface ICouponRepo {
    addCoupon (coupon: ICouponReqs): Promise<ICouponRes>
    findCouponsOnTheater (theaterId: string): Promise<ICouponRes[]>
    findCouponById (couponId: string): Promise<ICouponRes | null>
    getAvailableCoupons (): Promise<ICouponRes[]>
}