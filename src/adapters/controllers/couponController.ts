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
}