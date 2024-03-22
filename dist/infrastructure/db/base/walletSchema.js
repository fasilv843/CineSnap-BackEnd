"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletSchema = void 0;
const mongoose_1 = require("mongoose");
const walletHistorySchema_1 = require("../subSchema/walletHistorySchema");
exports.walletSchema = new mongoose_1.Schema({
    wallet: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    walletHistory: [walletHistorySchema_1.walletHistorySchema],
});
