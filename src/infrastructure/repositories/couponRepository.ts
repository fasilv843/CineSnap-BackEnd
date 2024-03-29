import { couponModel } from "../db/couponModel";
import { ICouponRepo } from "../../application/interfaces/repos/couponRepo"; 
import { ICouponReqs, ICouponRes } from "../../application/interfaces/types/coupon";

export class CouponRepository implements ICouponRepo {
    async addCoupon (coupon: ICouponReqs): Promise<ICouponRes> {
        return await new couponModel(coupon).save() as unknown as ICouponRes
    }

    async findCouponsOnTheater (theaterId: string): Promise<ICouponRes[]> {
        return await couponModel.find({ theaterId })
    }

    async findCouponById (couponId: string): Promise<ICouponRes | null> {
        return await couponModel.findById(couponId)
    }

    async updateCancelStatus (couponId: string, currCancelStatus: boolean): Promise<ICouponRes | null> {
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