import { Request, Response } from "express";
import { CouponUseCase } from "../../application/useCases/couponUseCase"; 
import { ICouponReqs } from "../../application/interfaces/types/coupon";

export class CouponController {
    constructor (
        private readonly _couponUseCase: CouponUseCase
    ) {}

    async addCoupon (req: Request, res: Response) {
        const coupon: ICouponReqs = req.body.coupon
        const couponRes = await this._couponUseCase.addCoupon(coupon)
        res.status(couponRes.status).json(couponRes)
    }

    async getCouponsOnTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const couponRes = await this._couponUseCase.getCouponsOnTheater(theaterId)
        res.status(couponRes.status).json(couponRes)
    }

    async cancelCoupon (req: Request, res: Response) {
        const couponId = req.params.couponId
        const couponRes = await this._couponUseCase.cancelCoupon(couponId)
        res.status(couponRes.status).json(couponRes)
    }

    async getApplicableCoupons (req: Request, res: Response) {
        const userId = req.params.userId
        const ticketId = req.query.ticketId as string
        const couponRes = await this._couponUseCase.getApplicableCoupons(userId, ticketId)
        res.status(couponRes.status).json(couponRes)
    }
}