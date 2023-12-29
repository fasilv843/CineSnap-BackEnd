import { Schema } from "mongoose";
import { ISingleScreenSeat } from "../../../interfaces/schema/screenSeatSchema";

export const singleScreenSeatSchema: Schema = new Schema<ISingleScreenSeat & Document>({
    col: {
        type: Number,
        min: 0,
        max: 30,
        required: true
    },
    isDummy: {
        type: Boolean,
        default: function() {
            return this.col === 0;
        },
        required: true
    }
})