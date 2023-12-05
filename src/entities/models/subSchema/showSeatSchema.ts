import { Schema } from "mongoose";
import { IShowSeat } from "../../../interfaces/schema/showSchema";


export const showSeatSchema: Schema = new Schema<IShowSeat & Document>({
    col: {
        type: Number,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false,
        required: true
    }
})