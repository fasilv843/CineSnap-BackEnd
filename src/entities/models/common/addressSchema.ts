import { Schema } from "mongoose";
import { ITheaterAddress, IUserAddress } from "../../../interfaces/common";
import { ZipRegex } from "../../../constants/constants";

export const userAddressSchema: Schema = new Schema<IUserAddress & Document>({
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        match: new RegExp(ZipRegex),
        required: true
    }
})

export const theaterAddressSchema: Schema = new Schema<ITheaterAddress & Document>({
    ...userAddressSchema.obj,
    landmark: String,
})