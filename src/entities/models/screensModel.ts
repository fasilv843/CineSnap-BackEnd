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
    defaultPrice: {
        type: Number,
        required: [true, 'Add a default price for movies in this screen']
    },
    seatsCount: {
        type: Number,
        required: [true, 'Provide seat count']
    },
    seats: {
        type: Map,
        of: { type: [Number] },
    }    
})

export const screenModel: Model<IScreen & Document> = mongoose.model<IScreen & Document>('Screens', ScreenSchema)
