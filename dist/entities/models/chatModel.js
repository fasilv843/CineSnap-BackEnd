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
exports.chatModel = exports.chatSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.chatSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        // required: true
        validate: function () {
            return validateParticipants(this.userId, this.theaterId, this.adminId);
        },
    },
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Theaters',
        // required: true
        validate: function () {
            return validateParticipants(this.userId, this.theaterId, this.adminId);
        },
    },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
        validate: function () {
            return validateParticipants(this.userId, this.theaterId, this.adminId);
        },
    },
    messages: [{
            sender: {
                type: String,
                enum: ['User', 'Theater', 'Admin'],
                required: true
            },
            message: {
                type: String,
                required: true,
            },
            time: {
                type: Date,
                default: Date.now,
                required: true
            },
            isRead: {
                type: Boolean,
                default: false,
                required: true
            }
        }]
}, {
    timestamps: true
});
// Compound index to ensure uniqueness of userId, theaterId, and adminId
exports.chatSchema.index({ userId: 1, theaterId: 1, adminId: 1 }, { unique: true });
// Custom validation function
function validateParticipants(userId, theaterId, adminId) {
    const fieldsCount = [userId, theaterId, adminId].filter(Boolean).length;
    // console.log('validating, count == 2', fieldsCount);
    return fieldsCount === 2;
}
exports.chatModel = mongoose_1.default.model('Chats', exports.chatSchema);
