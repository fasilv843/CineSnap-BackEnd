import mongoose, { Model, Schema } from "mongoose";
import { ITheater } from "../../interfaces/schema/theaterSchema";



const theaterSchema: Schema = new Schema<ITheater & Document>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        sparse: true, // Allows multiple documents with null values
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,

    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    liscenceId: {
        type: String,
        required: true
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
    address: {
        country: {
            type: String
        },
        state: {
            type: String
        },
        district: {
            type: String
        },
        city: {
            type: String
        },
        zip: {
            type: Number
        },
        landmark: {
            type: String
        }
    },
    wallet: {
        type: Number,
        default: 0
    },
    walletHistory: [{
        date: {
            type: Date,
        },
        amount: {
            type: Number
        },
        message: {
            type: String
        }
    }],
},
{
    timestamps: true
})

theaterSchema.index({ 'coords': '2dsphere' });
theaterSchema.index({ name: 'text' });

export const theaterModel: Model<ITheater & Document> = mongoose.model<ITheater & Document>('Theaters', theaterSchema)


