"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTicketSchema = void 0;
const mongoose_1 = require("mongoose");
const ticketSeatSchema_1 = require("../subSchema/ticketSeatSchema");
exports.baseTicketSchema = new mongoose_1.Schema({
    showId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'showId is required'],
        ref: 'Shows'
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    },
    movieId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'movieId is required'],
        ref: 'Movies'
    },
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'theaterId is required'],
        ref: 'Theaters'
    },
    screenId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'screenId is required'],
        ref: 'Screens'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    diamondSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    goldSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    silverSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
