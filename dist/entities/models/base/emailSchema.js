"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
exports.emailSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: new RegExp(constants_1.emailRegex)
    }
});
