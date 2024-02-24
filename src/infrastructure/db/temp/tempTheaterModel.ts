import mongoose, { Model, Schema } from "mongoose";
import { ITempTheaterRes } from "../../../application/interfaces/types/tempTheater";
import baseTheaterSchema from "../base/baseTheaterSchema";


const tempTheaterSchema: Schema = new Schema<ITempTheaterRes & Document>({
    otp: {
        type: Number,
        // min: 1000,
        // max: 9999
    },
    // TTL Indexing
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15 // expires after 15 mins
    }
})

tempTheaterSchema.add(baseTheaterSchema)

tempTheaterSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });


export const tempTheaterModel: Model<ITempTheaterRes & Document> = mongoose.model<ITempTheaterRes & Document>('TempTheaters', tempTheaterSchema)