import mongoose, { Schema, Model, ObjectId } from "mongoose"
import { ICoupon } from "../../interfaces/schema/couponSchema"

interface ICouponSchema extends Omit<ICoupon, 'theaterId'>, Document {
    theaterId: ObjectId
}

export const couponSchema: Schema = new Schema<ICouponSchema>({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        ref: 'Theaters',
        required: true
    },
    couponType: {
        type: String,
        enum: ['Once', 'Weekly', 'Monthly', 'Yearly'],
        default: 'Once',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required() {
            return this.couponType === 'Once'
        } 
    },
    discountType: {
        type: String,
        enum: ['Fixed Amount', 'Percentage'],
        required: true
    },
    maxDiscountAmt: {
        type: Number,
        required() {
            return this.discountType === 'Percentage'
        }
    },
    discount: {
        type: Number,
        required: true
    },
    minTicketCount: {
        type: Number,
        default: 0,
        required: true,
        min: 0,
        max: 10
    },
    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    couponCount: {
        type: Number,
        default: Infinity,
        required: true,
        min: 0
    }
})

couponSchema.pre('save', function (next) {
    // Check and set default value for minTicketCount
    if (typeof this.minTicketCount !== 'number' || isNaN(this.minTicketCount)) {
        this.minTicketCount = 0;
    }

    // Check and set default value for couponCount
    if (typeof this.couponCount !== 'number' || isNaN(this.couponCount)) {
        this.couponCount = Infinity;
    }

    // Continue with the save operation
    next();
});


export const couponModel: Model<ICouponSchema> = mongoose.model<ICouponSchema>('Coupons', couponSchema)

// TnC:{
//     type: [String],
//     default: [],
//     required: true
// }