"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletHistorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.walletHistorySchema = new mongoose_1.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Date field is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
});
