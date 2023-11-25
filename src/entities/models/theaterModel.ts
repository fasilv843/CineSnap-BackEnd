import mongoose, { Model, Schema } from "mongoose";
import { ITheater } from "../../interfaces/schema/theaterSchema";
import { theaterAddressSchema } from "./common/addressSchema";
import { walletHistorySchema } from "./common/walletHistorySchema";



const theaterSchema: Schema = new Schema<ITheater & Document>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        sparse: true, // Allows multiple documents with null values
    },
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    liscenceId: {
        type: String,
        required: true
    },
    coords: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            min: 2,
            max: 2,
            required: true,
        },
    },
    address: theaterAddressSchema,
    isGoogleAuth: {
        type: Boolean,
        default: false,
        required: true
    },
    wallet: {
        type: Number,
        default: 0,
        required: true
    },
    walletHistory: [walletHistorySchema],
},
{
    timestamps: true
})

theaterSchema.index({ 'coords': '2dsphere' });
theaterSchema.index({ name: 'text' });

export const theaterModel: Model<ITheater & Document> = mongoose.model<ITheater & Document>('Theaters', theaterSchema)


