"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInBetween = exports.getCurrentYearPeriod = exports.getCurrentMonthPeriod = exports.getCurrentWeekPeriod = void 0;
// this fuction returns starting and ending date of current week of a Weekly coupon
function getCurrentWeekPeriod(startDate) {
    const currentDate = new Date();
    const daysUntilStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const currentWeekStart = new Date(startDate);
    currentWeekStart.setDate(startDate.getDate() + Math.floor(daysUntilStart / 7) * 7);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    return { weekStart: currentWeekStart, weekEnd: currentWeekEnd };
}
exports.getCurrentWeekPeriod = getCurrentWeekPeriod;
// returns start as 1st of the month and end as 31st of the month (or last date of the month)
function getCurrentMonthPeriod(startDate) {
    const currentMonthStart = new Date(startDate);
    currentMonthStart.setDate(1);
    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(currentMonthStart.getMonth() + 1);
    const monthEnd = new Date(nextMonthStart);
    monthEnd.setDate(monthEnd.getDate() - 1);
    return { monthStart: currentMonthStart, monthEnd };
}
exports.getCurrentMonthPeriod = getCurrentMonthPeriod;
// returns start and end of the year based on startDate
// if start 5th Mar, 2024, yearStart: 5th Mar, Current Year, yearEnd: 4th Mar, Next Year
function getCurrentYearPeriod(startDate) {
    const currentYearStart = new Date(startDate);
    currentYearStart.setMonth(0, 1);
    const nextYearStart = new Date(currentYearStart);
    nextYearStart.setFullYear(currentYearStart.getFullYear() + 1);
    const yearEnd = new Date(nextYearStart);
    yearEnd.setDate(yearEnd.getDate() - 1);
    return { yearStart: currentYearStart, yearEnd };
}
exports.getCurrentYearPeriod = getCurrentYearPeriod;
// returns true if target date is in between start and end date
function isDateInBetween(targetDate, startDate, endDate) {
    return targetDate >= startDate && targetDate <= endDate;
}
exports.isDateInBetween = isDateInBetween;
