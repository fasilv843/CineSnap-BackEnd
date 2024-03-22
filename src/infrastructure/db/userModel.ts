import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../../entities/user";
import { userAddressSchema } from "./subSchema/addressSchema";
import { walletSchema } from "./base/walletSchema";
import { emailSchema } from "./base/emailSchema";
import { mobileSchema } from "./base/mobileSchema";


const userSchema: Schema = new Schema<IUser & Document>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must contain at least 3 characters'],
        maxlength: [20, 'Name contain at most 20 characters']
    },
    password: {
        type: String,
        required() {
            return !this.isGoogleAuth
        }
    },
    isBlocked: {
        type: Boolean,
        default : false,
        required: true
    },
    isGoogleAuth: {
        type: Boolean,
        required: true,
        default: false
    },
    dob:{
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
    address: userAddressSchema,
    usedCoupons: {
        type: [{
            couponId: {
                type: Schema.Types.ObjectId,
                ref: 'Coupons',
                required: true
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            ticketId: {
                type: Schema.Types.ObjectId,
                ref: 'Tickets',
                required: true
            }
        }],
        default: [],
        required: true
    } 
},
{
    timestamps : true
});

userSchema.add(emailSchema)
userSchema.add(mobileSchema)
userSchema.add(walletSchema)

const userModel: Model< IUser & Document > = mongoose.model< IUser & Document >('Users', userSchema);

export default userModel;