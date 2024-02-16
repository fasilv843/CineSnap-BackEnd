import { ICouponReqs, ICouponRes } from "../../interfaces/schema/couponSchema";

export interface ICouponRepo {
    addCoupon (coupon: ICouponReqs): Promise<ICouponRes>
}