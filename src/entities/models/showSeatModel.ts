import mongoose, { Schema, Model } from "mongoose";
import { IShowSeatCategory, IShowSeats } from "../../interfaces/schema/showSeatsSchema";
import { showSingleSeatSchema } from "./subSchema/showSeatSchema";

export function getShowSeatCategorySchema(defaultName: string): Schema<Document & IShowSeatCategory> {
    return new Schema<IShowSeatCategory & Document>({
        name: {
          type: String,
          default: defaultName,
          required: true,
        },
        price: {
            type: Number,
            required: true
        },
        seats: {
          type: Map,
          of: [showSingleSeatSchema],
        },
    });
}

export const showSeatsSchema: Schema = new Schema<IShowSeats & Document>({
    diamond: getShowSeatCategorySchema('Diamond'),
    gold: getShowSeatCategorySchema('Gold'),
    silver: getShowSeatCategorySchema('Silver'),
})

export const showSeatsModel: Model<IShowSeats & Document> = mongoose.model<IShowSeats & Document>('ShowSeats', showSeatsSchema)
