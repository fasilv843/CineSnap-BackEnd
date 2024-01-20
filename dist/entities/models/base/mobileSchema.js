"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileSchema = void 0;
const mongoose_1 = require("mongoose");
exports.mobileSchema = new mongoose_1.Schema({
    mobile: {
        type: String,
        unique: true,
        sparse: true,
    }
});
