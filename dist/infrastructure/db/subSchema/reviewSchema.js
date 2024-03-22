"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = require("mongoose");
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
        type: mongoose_1.Schema.Types.ObjectId,
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
