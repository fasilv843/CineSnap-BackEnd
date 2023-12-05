import mongoose, { Model, Schema } from "mongoose";
import { IShow } from "../../interfaces/schema/showSchema";
import { showSeatSchema } from "./subSchema/showSeatSchema";


export const showSchema: Schema = new Schema<IShow & Document>({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movies',
        required: true
    },
    screenId: {
        type: Schema.Types.ObjectId,
        ref: 'Screens',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    totalSeatCount: {
        type: Number,
        required: true
    },
    availableSeatCount: {
        type: Number,
        required: true
    },
    seats: {
        type: Map,
        of: [showSeatSchema]
    }
})

export const showModel: Model<IShow & Document> = mongoose.model<IShow & Document>('Shows', showSchema)
