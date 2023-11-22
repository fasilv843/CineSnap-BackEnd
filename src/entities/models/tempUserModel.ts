import mongoose, { Model, Schema } from "mongoose";
import { ITempUserRes } from "../../interfaces/schema/tempUserSchema";


const tempUserSchema: Schema = new Schema<ITempUserRes & Document>({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        // min: 1000,
        // max: 9999
    },
    password: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15 // expires after 15 mins
    }
})

tempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });


export const tempUserModel: Model<ITempUserRes & Document> = mongoose.model<ITempUserRes & Document>('TempUsers', tempUserSchema)