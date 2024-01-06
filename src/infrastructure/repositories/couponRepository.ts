import { couponModel } from "../../entities/models/couponModel";
import { ICouponRepo } from "../../interfaces/repos/couponRepo";
import { ICouponReqs, ICouponRes } from "../../interfaces/schema/couponSchema";

export class CouponRepository implements ICouponRepo {
    async addCoupon (coupon: ICouponReqs): Promise<ICouponRes> {
        return await new couponModel(coupon).save()
    }
}