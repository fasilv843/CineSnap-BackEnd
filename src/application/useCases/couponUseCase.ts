import { log } from "console";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { IApiRes } from "../interfaces/types/common";
import { ICouponReqs, ICouponRes } from "../interfaces/types/coupon";
import { filterUnusedCoupons } from "../../infrastructure/helperFunctions/getUnusedCoupons";
import { ICouponRepo } from "../interfaces/repos/couponRepo";
import { ITheaterRepo } from "../interfaces/repos/theaterRepo";
import { IUserRepo } from "../interfaces/repos/userRepo";
import { ITempTicketRepo } from "../interfaces/repos/tempTicketRepo";

export class CouponUseCase {
    constructor (
        private readonly _couponRepository: ICouponRepo,
        private readonly _theaterRepository: ITheaterRepo,
        private readonly _tempTicketRepository: ITempTicketRepo,
        private readonly _userRepository: IUserRepo
    ) {}

    async addCoupon (coupon: ICouponReqs): Promise<IApiRes<ICouponRes | null>> {
        try {
            log(coupon, 'coupon')
            if (coupon.discountType === 'Percentage' && coupon.maxDiscountAmt === undefined) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Add a limit to discount if discount type is percentage')
            }
            const theater = await this._theaterRepository.findById(coupon.theaterId)
            if (theater) {
                const savedCoupon = await this._couponRepository.addCoupon(coupon)
                return get200Response(savedCoupon)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getCouponsOnTheater (theaterId: string): Promise<IApiRes<ICouponRes[] | null>> {
        try {
            const theater = await this._theaterRepository.findById(theaterId)
            if (theater === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            const coupons = await this._couponRepository.findCouponsOnTheater(theaterId)
            if (coupons.length > 0) {
                return get200Response(coupons)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Coupons not available')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async cancelCoupon (couponId: string): Promise<IApiRes<ICouponRes | null>> {
        try {
            const coupon = await this._couponRepository.findCouponById(couponId)
            if (coupon === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid coupon id')
            const updatedCoupon = await this._couponRepository.updateCancelStatus(couponId, coupon.isCancelled)
            if (updatedCoupon) return get200Response(updatedCoupon)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid coupon id')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getApplicableCoupons (userId: string, ticketId: string): Promise<IApiRes<ICouponRes[] | null>> {
        try {
            const availCoupons = await this._couponRepository.getAvailableCoupons()
            if (availCoupons.length) {
                const ticket = await this._tempTicketRepository.findTempTicketById(ticketId)
                if (ticket === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'invalid Ticket id')

                const filteredCoupons = availCoupons.filter(coupon => coupon.minTicketCount <= ticket.seatCount)
                if (filteredCoupons.length === 0) return get200Response(filteredCoupons) // returning empty array, after filtering

                const userCoupons = await this._userRepository.findUserCoupons(userId)
                if (!userCoupons) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')

                const unusedCoupons = filterUnusedCoupons(filteredCoupons, userCoupons.usedCoupons)
                return get200Response(unusedCoupons)
            } else {
                return get200Response(availCoupons) // returning empty array as response
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}