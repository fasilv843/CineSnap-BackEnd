"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPast = exports.isToday = exports.calculateHoursDifference = void 0;
function calculateHoursDifference(targetDate) {
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // convert milliseconds to hours
    return hoursDifference;
}
exports.calculateHoursDifference = calculateHoursDifference;
function isToday(date) {
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
}
exports.isToday = isToday;
function isPast(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return date < yesterday;
}
exports.isPast = isPast;
