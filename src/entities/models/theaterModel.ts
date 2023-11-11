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
        // required: true
        unique: true
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
        default : false
    },
    coords: {
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
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
        }
    },
    wallet: {
        type: Number,
        default: 0
    },
    walletHistory : [{
        date : {
            type : Date,
        },
        amount : {
            type : Number
        },
        message : {
            type : String
        }
    }],
},
{
    timestamps : true
})

export const theaterModel: Model< ITheater & Document> = mongoose.model< ITheater & Document>('Theaters', theaterSchema)
