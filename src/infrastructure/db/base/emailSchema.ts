import { Schema } from "mongoose";
import { emailRegex } from "../../constants/constants";

export const emailSchema: Schema = new Schema<{ email: string } & Document>({
    email: {
        type: String,
        required: true,
        unique: true,
        match: new RegExp(emailRegex)
    }
})