import mongoose, { Model, Schema } from "mongoose";
import { ISingleScreenSeat, IScreenSeatCategory, IScreenSeat } from "../../interfaces/schema/screenSeatSchema";
import { singleScreenSeatSchema } from "./subSchema/singleScreenSeatModel";



export function getScreenSeatCategorySchema(defaultName: string, singleScreenSeatSchema: Schema<ISingleScreenSeat & Document>): Schema<Document & IScreenSeatCategory> {
    return new Schema<IScreenSeatCategory & Document>({
        name: {
          type: String,
          default: defaultName,
          required: true,
        },
        seats: {
          type: Map,
          of: [singleScreenSeatSchema],
        },
    });
}

export const screenSeatSchema: Schema = new Schema<IScreenSeat & Document>({
    diamond: getScreenSeatCategorySchema('Diamond', singleScreenSeatSchema),
    gold: getScreenSeatCategorySchema('Gold', singleScreenSeatSchema),
    silver: getScreenSeatCategorySchema('Silver', singleScreenSeatSchema),
})

export const screenSeatModel: Model<IScreenSeat & Document> = mongoose.model<IScreenSeat & Document>('ScreenSeats', screenSeatSchema)