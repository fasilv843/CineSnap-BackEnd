import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { CouponRepository } from "../infrastructure/repositories/couponRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { IApiRes } from "../interfaces/common";
import { ICouponReqs, ICouponRes } from "../interfaces/schema/couponSchema";

export class CouponUseCase {
    constructor (
        private readonly couponRepository: CouponRepository,
        private readonly theaterRepository: TheaterRepository,
    ) {}

    async addCoupon (coupon: ICouponReqs): Promise<IApiRes<ICouponRes | null>> {
        try {
            if (coupon.discountType === 'Percentage' && coupon.maxDiscountAmt === undefined) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Add a limit to discount if discount type is percentage')
            }
            const theater = await this.theaterRepository.findById(coupon.theaterId)
            if (theater) {
                const savedCoupon = await this.couponRepository.addCoupon(coupon)
                return get200Response(savedCoupon)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}