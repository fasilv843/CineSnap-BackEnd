import { Request, Response } from "express";
import { CouponUseCase } from "../../useCases/couponUseCase";
import { ICouponReqs } from "../../interfaces/schema/couponSchema";
import { ID } from "../../interfaces/common";

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
        const theaterId = req.params.theaterId as unknown as ID
        const couponRes = await this.couponUseCase.getCouponsOnTheater(theaterId)
        res.status(couponRes.status).json(couponRes)
    }

    async cancelCoupon (req: Request, res: Response) {
        const couponId = req.params.couponId as unknown as ID
        const couponRes = await this.couponUseCase.cancelCoupon(couponId)
        res.status(couponRes.status).json(couponRes)

    }
}