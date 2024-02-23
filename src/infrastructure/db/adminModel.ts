import mongoose, { Model, Schema } from "mongoose";
import { walletSchema } from "./base/walletSchema";
import { emailSchema } from "./base/emailSchema";
import { IAdmin } from "../../entities/admin";

const adminSchema: Schema = new Schema<IAdmin & Document>({
    password: {
        type:String,
        required: true
    }
})

adminSchema.add(emailSchema)
adminSchema.add(walletSchema)

export const adminModel: Model< IAdmin & Document> = mongoose.model< IAdmin & Document>('Admin', adminSchema)