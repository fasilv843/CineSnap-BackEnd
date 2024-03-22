"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theaterAddressSchema = exports.userAddressSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants/constants");
exports.userAddressSchema = new mongoose_1.Schema({
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    district: {
        type: String,
        required: [true, 'District is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    zip: {
        type: Number,
        match: [new RegExp(constants_1.ZipRegex), 'Invalid ZIP code. Please enter a valid 6-digit ZIP code.'],
        required: [true, 'Zip is required']
    }
});
exports.theaterAddressSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, exports.userAddressSchema.obj), { landmark: String }));
