"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyShowSeat = exports.getShowSeatCategory = void 0;
const constants_1 = require("../constants/constants");
function getShowSeatCategory(screenCat, price) {
    if (screenCat.seats.size === 0)
        return undefined;
    const showSeatMap = new Map();
    for (const [rowName, row] of screenCat.seats) {
        const showSeatRow = row.map(x => ({ col: x, isBooked: false }));
        showSeatMap.set(rowName, showSeatRow);
    }
    return {
        name: screenCat.name,
        price,
        seats: showSeatMap
    };
}
exports.getShowSeatCategory = getShowSeatCategory;
function createEmptyShowSeat(screenSeat) {
    return {
        diamond: getShowSeatCategory(screenSeat.diamond, constants_1.DEF_DIAMOND_PRICE),
        gold: getShowSeatCategory(screenSeat.gold, constants_1.DEF_GOLD_PRICE),
        silver: getShowSeatCategory(screenSeat.silver, constants_1.DEF_SILVER_PRICE)
    };
}
exports.createEmptyShowSeat = createEmptyShowSeat;
