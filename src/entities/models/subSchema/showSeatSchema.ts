import { Schema } from "mongoose";
import { IShowSingleSeat } from "../../../interfaces/schema/showSchema";


export const showSingleSeatSchema: Schema = new Schema<IShowSingleSeat & Document>({
    col: {
        type: Number,
        required: true,
        min: [0, 'Col cannot be a negative number'],
        max: [30, 'Max col number is 30']
    },
    isBooked: {
        type: Boolean,
        default: false,
        required: [true, 'Specify availability of the seat']
    }
})