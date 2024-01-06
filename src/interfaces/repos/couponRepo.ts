import { ICouponReqs, ICouponRes } from "../schema/couponSchema";

export interface ICouponRepo {
    addCoupon (coupon: ICouponReqs): Promise<ICouponRes>
}