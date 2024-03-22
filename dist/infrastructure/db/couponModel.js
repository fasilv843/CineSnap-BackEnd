"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponModel = exports.couponSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true
    },
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            return this.couponType === 'Once';
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
            return this.discountType === 'Percentage';
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
});
exports.couponSchema.pre('save', function (next) {
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
exports.couponModel = mongoose_1.default.model('Coupons', exports.couponSchema);
// TnC:{
//     type: [String],
//     default: [],
//     required: true
// }
