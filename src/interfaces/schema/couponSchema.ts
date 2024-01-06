import { ID } from "../../interfaces/common"

export interface ICoupon {
    _id: ID
    code: string
    theaterId: ID
    description: string
    startDate: Date
    endDate: Date
    discount: number
    minTicketCount: number
    couponType: 'Once' | 'Weekly' | 'Monthly' | 'Yearly'
    discountType: 'Fixed Amount' | 'Percentage'
    maxDiscountAmt: number
    isCancelled: boolean,
    couponCount: number
}

export interface ICouponReqs extends Omit<ICoupon, '_id' | 'isCancelled'> {}
export interface ICouponRes extends ICoupon {}