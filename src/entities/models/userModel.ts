import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../../interfaces/schema/userSchema"; 


const userSchema: Schema = new Schema<IUser & Document>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default : false
    },
    dob:{
        type: Date,
        default: new Date('1990-01-01'),
        min: new Date('1900-01-01'),
        max: new Date()
    },
    profilePic: {
        type: String
    },
    location: {
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
    }
},
{
    timestamps : true
});

const userModel: Model< IUser & Document > = mongoose.model< IUser & Document >('Users', userSchema);

export default userModel;