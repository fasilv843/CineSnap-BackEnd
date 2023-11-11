import mongoose, { Model, Schema } from "mongoose";
import { IAdmin } from "../../interfaces/schema/adminSchema";

const adminSchema: Schema = new Schema<IAdmin & Document>({
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required: true
    }
})

export const adminModel: Model< IAdmin & Document> = mongoose.model< IAdmin & Document>('Admin', adminSchema)