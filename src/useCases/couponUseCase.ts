import { log } from "console";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { CouponRepository } from "../infrastructure/repositories/couponRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { IApiRes, ID } from "../interfaces/common";
import { ICouponReqs, ICouponRes } from "../interfaces/schema/couponSchema";

export class CouponUseCase {
    constructor (
        private readonly couponRepository: CouponRepository,
        private readonly theaterRepository: TheaterRepository,
    ) {}

    async addCoupon (coupon: ICouponReqs): Promise<IApiRes<ICouponRes | null>> {
        try {
            log(coupon, 'coupon')
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

    async getCouponsOnTheater (theaterId: ID): Promise<IApiRes<ICouponRes[] | null>> {
        try {
            const theater = await this.theaterRepository.findById(theaterId)
            if (theater === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            const coupons = await this.couponRepository.findCouponsOnTheater(theaterId)
            if (coupons.length > 0) {
                return get200Response(coupons)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Coupons not available')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelCoupon (couponId: ID): Promise<IApiRes<ICouponRes | null>> {
        try {
            const coupon = await this.couponRepository.findCouponById(couponId)
            if (coupon === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid coupon id')
            const updatedCoupon = await this.couponRepository.updateCancelStatus(couponId, coupon.isCancelled)
            if (updatedCoupon) return get200Response(updatedCoupon)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid coupon id')
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}