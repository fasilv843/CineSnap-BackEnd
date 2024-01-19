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
const mongoose_1 = __importStar(require("mongoose"));
const addressSchema_1 = require("./subSchema/addressSchema");
const walletSchema_1 = require("./base/walletSchema");
const emailSchema_1 = require("./base/emailSchema");
const mobileSchema_1 = require("./base/mobileSchema");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must contain atleast 3 characters'],
        maxlength: [20, 'Name contain atmost 20 characters']
    },
    password: {
        type: String,
        required() {
            return !this.isGoogleAuth;
        }
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    isGoogleAuth: {
        type: Boolean,
        required: true,
        default: false
    },
    dob: {
        type: Date,
        default: new Date('1990-01-01'),
        min: new Date('1900-01-01'),
        max: new Date(),
        required: true
    },
    profilePic: String,
    coords: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            // required: true
        },
        coordinates: {
            type: [Number],
            min: 2,
            max: 2,
            // required: true,
        },
    },
    address: addressSchema_1.userAddressSchema,
    usedCoupons: {
        type: [{
                couponId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Coupons',
                    required: true
                },
                date: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                ticketId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Tickets',
                    required: true
                }
            }],
        default: [],
        required: true
    }
}, {
    timestamps: true
});
userSchema.add(emailSchema_1.emailSchema);
userSchema.add(mobileSchema_1.mobileSchema);
userSchema.add(walletSchema_1.walletSchema);
const userModel = mongoose_1.default.model('Users', userSchema);
exports.default = userModel;
