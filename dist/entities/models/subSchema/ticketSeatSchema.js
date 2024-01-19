"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSeatCategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.ticketSeatCategorySchema = new mongoose_1.Schema({
    seats: {
        type: [String],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    singlePrice: {
        type: Number,
        required: true
    },
    CSFeePerTicket: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        requied: true
    }
});
