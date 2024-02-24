import { Schema } from "mongoose";
import { ITempTheaterRes } from "../../../application/interfaces/types/tempTheater";
import { emailSchema } from "./emailSchema";
import { theaterAddressSchema } from "../subSchema/addressSchema";

const baseTheaterSchema: Schema = new Schema<ITempTheaterRes & Document>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    liscenceId: {
        type: String,
        required: [true, 'Provide your Liscence ID']
    },
    coords: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            min: 2,
            max: 2,
            required: true,
        },
    },
    address:{ 
        type: theaterAddressSchema,
        required: [true, 'Address is required']
    },
});

baseTheaterSchema.add(emailSchema)

export default baseTheaterSchema