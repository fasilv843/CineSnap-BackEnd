import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../../interfaces/schema/userSchema"; 
import { emailRegex } from "../../constants/constants";
import { userAddressSchema } from "./common/addressSchema";
import { walletHistorySchema } from "./common/walletHistorySchema";


const userSchema: Schema = new Schema<IUser & Document>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: new RegExp(emailRegex)
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true,
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
    profilePic: {
        type: String
    },
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
    wallet: {
        type: Number,
        default: 0,
        required: true
    },
    walletHistory: [walletHistorySchema],
},
{
    timestamps : true
});

const userModel: Model< IUser & Document > = mongoose.model< IUser & Document >('Users', userSchema);

export default userModel;