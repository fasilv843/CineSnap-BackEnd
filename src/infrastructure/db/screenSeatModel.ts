import mongoose, { Model, Schema } from "mongoose";
import { IScreenSeat, IScreenSeatCategory } from "../../entities/screenSeat";

export function getScreenSeatCategorySchema(defaultName: string): Schema<Document & IScreenSeatCategory> {
    return new Schema<IScreenSeatCategory & Document>({
        name: {
          type: String,
          default: defaultName,
          required: true,
        },
        seats: {
          type: Map,
          of: [Number],
        },
    });
}

export const screenSeatSchema: Schema = new Schema<IScreenSeat & Document>({
    diamond: getScreenSeatCategorySchema('Diamond'),
    gold: getScreenSeatCategorySchema('Gold'),
    silver: getScreenSeatCategorySchema('Silver'),
})

export const screenSeatModel: Model<IScreenSeat & Document> = mongoose.model<IScreenSeat & Document>('ScreenSeats', screenSeatSchema)