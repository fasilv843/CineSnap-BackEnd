"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenModel = exports.ScreenSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.ScreenSchema = new mongoose_1.Schema({
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'theaterId is required, screens can\'t exist in space :/'],
        ref: 'Theaters',
        readonly: true
    },
    name: {
        type: String,
        required: [true, 'Provide a Name to Screen'],
        trim: true
    },
    seatsCount: {
        type: Number,
        required: [true, 'Provide seat count'],
        min: [1, 'Seat Count cannot be zero']
    },
    rows: {
        type: String,
        required: true
    },
    cols: {
        type: Number,
        required: true
    },
    seatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ScreenSeats',
        required: true,
        unique: true,
        readonly: true
    }
});
exports.screenModel = mongoose_1.default.model('Screens', exports.ScreenSchema);
