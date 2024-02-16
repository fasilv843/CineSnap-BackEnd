import mongoose, { Model, Schema } from "mongoose";
import { IScreen } from "../../interfaces/schema/screenSchema";

export const ScreenSchema: Schema = new Schema<IScreen & Document>({
    theaterId: {
        type: Schema.Types.ObjectId,
        required: [true, 'theaterId is required, screens can\'t exist in space :/'],
        ref: 'Theaters',
        readonly: true
    },
    name: {
        type: String,
        required: [true, 'Provide a Name to Screen'],
        trim: true
    },
    seatsCount: {
        type: Number,
        required: [true, 'Provide seat count'],
        min: [1, 'Seat Count cannot be zero']
    },
    rows: {
        type: String,
        required: true
    },
    cols: {
        type: Number,
        required: true
    },
    seatId: { 
        type: Schema.Types.ObjectId,
        ref: 'ScreenSeats',
        required: true,
        unique: true,
        readonly: true
    }
})

export const screenModel: Model<IScreen & Document> = mongoose.model<IScreen & Document>('Screens', ScreenSchema)
