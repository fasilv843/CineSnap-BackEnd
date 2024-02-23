import mongoose, { Model, Schema } from "mongoose";
import { walletSchema } from "./base/walletSchema";
import { mobileSchema } from "./base/mobileSchema";
import baseTheaterSchema from "./base/baseTheaterSchema";
import { ITheater } from "../../entities/theater";



const theaterSchema: Schema = new Schema<ITheater & Document>({
    profilePic: String,
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    screenCount: {
        type: Number,
        default: 0,
        required: true
    },
    isGoogleAuth: {
        type: Boolean,
        default: false,
        required: true
    },
    socialMediaHandles: {
        type: Map,
        of: String
    },
    approvalStatus: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Pending',
        required: true
    }
},
{
    timestamps: true
})

theaterSchema.add(baseTheaterSchema)
theaterSchema.add(mobileSchema)
theaterSchema.add(walletSchema)

theaterSchema.index({ 'coords': '2dsphere' });
theaterSchema.index({ name: 'text' });

export const theaterModel: Model<ITheater & Document> = mongoose.model<ITheater & Document>('Theaters', theaterSchema)


