import { ICoupon } from "../../entities/coupon";

export interface ICouponReqs extends Omit<ICoupon, '_id' | 'isCancelled'> {}
export interface ICouponRes extends ICoupon {}