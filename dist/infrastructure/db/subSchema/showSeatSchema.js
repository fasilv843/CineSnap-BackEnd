"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSingleSeatSchema = void 0;
const mongoose_1 = require("mongoose");
exports.showSingleSeatSchema = new mongoose_1.Schema({
    col: {
        type: Number,
        required: true,
        min: [0, 'Col cannot be a negative number'],
        max: [30, 'Max col number is 30']
    },
    isBooked: {
        type: Boolean,
        default: false,
        required: [true, 'Specify availability of the seat']
    }
});
