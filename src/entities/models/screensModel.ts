import mongoose, { Model, Schema } from "mongoose";
import { IScreen } from "../../interfaces/schema/screenSchema";

export const ScreenSchema: Schema = new Schema<IScreen & Document>({
    theaterId: {
        type: Schema.Types.ObjectId,
        required: [true, 'theaterId is required, screens can\'t exist in space :/'],
        ref: 'Theaters'
    },
    name: {
        type: String,
        required: [true, 'Provide a Name to Screen']
    },
    seatsCount: {
        type: Number,
        required: [true, 'Provide seat count']
    },
    row: {
        type: String,
        required: true
    },
    col: {
        type: Number,
        required: true
    },
    seats: {
        type: Map,
        of: [Number]
    },
    // updatedSeats: {
    //     type: Map,
    //     of: [Number]
    // },
    // useSeatAfter: {
    //     type: Date,
    //     required(): boolean {
    //         return this.updatedSeats !== null
    //     }
    // }
})

export const screenModel: Model<IScreen & Document> = mongoose.model<IScreen & Document>('Screens', ScreenSchema)
