import { Request, Response } from "express";
import { CouponUseCase } from "../../useCases/couponUseCase"; 
import { ICouponReqs } from "../../interfaces/schema/couponSchema";

export class CouponController {
    constructor (
        private readonly couponUseCase: CouponUseCase
    ) {}

    async addCoupon (req: Request, res: Response) {
        const coupon: ICouponReqs = req.body.coupon
        const couponRes = await this.couponUseCase.addCoupon(coupon)
        res.status(couponRes.status).json(couponRes)
    }

    async getCouponsOnTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const couponRes = await this.couponUseCase.getCouponsOnTheater(theaterId)
        res.status(couponRes.status).json(couponRes)
    }

    async cancelCoupon (req: Request, res: Response) {
        const couponId = req.params.couponId
        const couponRes = await this.couponUseCase.cancelCoupon(couponId)
        res.status(couponRes.status).json(couponRes)
    }

    async getApplicableCoupons (req: Request, res: Response) {
        const userId = req.params.userId
        const ticketId = req.query.ticketId as string
        const couponRes = await this.couponUseCase.getApplicableCoupons(userId, ticketId)
        res.status(couponRes.status).json(couponRes)
    }
}