import { couponModel } from "../../entities/models/couponModel";
import { ID } from "../../interfaces/common";
import { ICouponRepo } from "../../interfaces/repos/couponRepo";
import { ICouponReqs, ICouponRes } from "../../interfaces/schema/couponSchema";

export class CouponRepository implements ICouponRepo {
    async addCoupon (coupon: ICouponReqs): Promise<ICouponRes> {
        return await new couponModel(coupon).save()
    }

    async findCouponsOnTheater (theaterId: ID): Promise<ICouponRes[]> {
        return await couponModel.find({ theaterId })
    }

    async findCouponById (couponId: ID): Promise<ICouponRes | null> {
        return await couponModel.findById(couponId)
    }

    async updateCancelStatus (couponId: ID, currCancelStatus: boolean): Promise<ICouponRes | null> {
        return await couponModel.findByIdAndUpdate(
            { _id: couponId },
            {
                $set: { isCancelled: !currCancelStatus }
            }
        )
    }

    async getAvailableCoupons (): Promise<ICouponRes[]> {
        const currentDate = new Date()
        return await couponModel.find({
            isCancelled: false,
            couponCount: { $gte: 1 },
            $or: [
                { couponType: { $ne: 'Once' } }, // Exclude 'Once' type from date checks
                {
                    couponType: 'Once',
                    endDate: { $gte: currentDate },
                    startDate: { $lte: currentDate }
                }
            ]
        })
    }
}