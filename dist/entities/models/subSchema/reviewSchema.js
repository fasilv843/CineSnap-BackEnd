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
exports.reviewSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.reviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Minimum rating is 1 star'],
        max: [5, 'Maximum rating is 5 star']
    },
    review: {
        type: String
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    }
});
// const userSchema = new Schema({
//     // `socialMediaHandles` is a map whose values are strings. A map's
//     // keys are always strings. You specify the type of values using `of`.
//     socialMediaHandles: {
//       type: Map,
//       of: String
//     }
//   });
//   const User = mongoose.model('User', userSchema);
//   // Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
//   console.log(new User({
//     socialMediaHandles: {
//       github: 'vkarpov15',
//       twitter: '@code_barbarian'
//     }
//   }).socialMediaHandles);
