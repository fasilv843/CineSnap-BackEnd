"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndingTime = void 0;
function getEndingTime(startTime, duration) {
    const endingTime = new Date(startTime); // Create a new Date object to avoid mutating the original startTime
    endingTime.setHours(endingTime.getHours() + duration.hours);
    endingTime.setMinutes(endingTime.getMinutes() + duration.minutes);
    return endingTime;
}
exports.getEndingTime = getEndingTime;
