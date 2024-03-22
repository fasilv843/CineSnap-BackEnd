"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailSchema_1 = require("./emailSchema");
const addressSchema_1 = require("../subSchema/addressSchema");
const baseTheaterSchema = new mongoose_1.Schema({
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
    address: {
        type: addressSchema_1.theaterAddressSchema,
        required: [true, 'Address is required']
    },
});
baseTheaterSchema.add(emailSchema_1.emailSchema);
exports.default = baseTheaterSchema;
