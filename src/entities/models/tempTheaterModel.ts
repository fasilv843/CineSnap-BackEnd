import mongoose, { Model, Schema } from "mongoose";

import { theaterAddressSchema } from "./common/addressSchema";
import { ITempTheaterRes } from "../../interfaces/schema/tempTheaterSchema";


const tempTheaterSchema: Schema = new Schema<ITempTheaterRes & Document>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    liscenceId: {
        type: String,
        required: [true, 'Provide your Liscence ID']
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
    address:{ 
        type: theaterAddressSchema,
        required: [true, 'Address is required']
    },
    otp: {
        type: Number,
        // min: 1000,
        // max: 9999
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15 // expires after 15 mins
    }
})

tempTheaterSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });


export const tempTheaterModel: Model<ITempTheaterRes & Document> = mongoose.model<ITempTheaterRes & Document>('TempTheaters', tempTheaterSchema)