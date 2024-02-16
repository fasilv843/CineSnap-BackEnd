import mongoose, { Model, Schema } from "mongoose";
import { IShow } from "../../interfaces/schema/showSchema";

interface IShowSchema extends Omit<IShow, 'movieId' | 'screenId' | 'seatId'>, Document {
    movieId: Schema.Types.ObjectId,
    screenId: Schema.Types.ObjectId,
    seatId: Schema.Types.ObjectId,
}

export const showSchema: Schema = new Schema<IShowSchema>({
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
    totalSeatCount: {
        type: Number,
        required: true
    },
    availableSeatCount: {
        type: Number,
        required: true
    },
    seatId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        // immutable: [true, 'Changing seatId is forbidden']
    }
})

export const showModel: Model<IShowSchema> = mongoose.model<IShowSchema>('Shows', showSchema)
