import mongoose, { Schema, Document, Model } from "mongoose";
import { User } from "../../interfaces/schemaInterface";


const userSchema: Schema = new Schema<User & Document>({
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

const userModel: Model< User & Document > = mongoose.model< User & Document >('Users', userSchema);

export default userModel;















// import mongoose, { Schema, Document, Model } from 'mongoose';
// import User from '../../domain/user';


// const userSchema: Schema = new Schema<User & Document>({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String },
//     isBlocked: { type: Boolean, default: false },
//     cart: [{
//     }],
//     wallet: { type: Number, default: 0 },
//     isGoogle: { type: Boolean, default: false },
//     profilePic: { type: String, default: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png' }
// }, {
//     timestamps: true
// });

// const UserModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

// export default UserModel;

