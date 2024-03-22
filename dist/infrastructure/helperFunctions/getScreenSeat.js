"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailSeatData = exports.getLastRow = exports.getRowKeys = exports.getSeatCount = exports.getCategorySeatCount = exports.getDefaultScreenSeatSetup = void 0;
const console_1 = require("console");
const constants_1 = require("../constants/constants");
function splitAlphabetsToThree(rows) {
    const index = constants_1.ALPHABETS.indexOf(rows.toUpperCase());
    const availRows = constants_1.ALPHABETS.slice(0, index + 1);
    let diamondSeats = '';
    let goldSeats = '';
    let silverSeats = '';
    diamondSeats += availRows.slice(0, 4);
    goldSeats += availRows.slice(4, 8);
    if (index >= 8)
        silverSeats += availRows.slice(8, index + 1);
    return {
        diamondSeats,
        goldSeats,
        silverSeats
    };
}
function assignSeats(seatAlphabets, rowArr) {
    const seatMap = new Map();
    for (let i = 0; i < seatAlphabets.length; i++) {
        seatMap.set(seatAlphabets[i], rowArr);
    }
    return seatMap;
}
function getDefaultScreenSeatSetup(rows, cols) {
    const seats = splitAlphabetsToThree(rows);
    const { diamondSeats, goldSeats, silverSeats } = seats;
    // Populate an array with objects from { col: 1 } to { col: cols }
    const rowArr = Array.from({ length: cols }, (_, index) => index + 1);
    (0, console_1.log)(rowArr, 'default rowArr for assingning to seats');
    const diamondSeatMap = assignSeats(diamondSeats, rowArr);
    const goldSeatMap = assignSeats(goldSeats, rowArr);
    const silverSeatMap = assignSeats(silverSeats, rowArr);
    (0, console_1.log)(diamondSeatMap, goldSeatMap, silverSeatMap, 'seat maps from get default seats setup');
    return {
        diamond: { seats: diamondSeatMap },
        gold: { seats: goldSeatMap },
        silver: { seats: silverSeatMap }
    };
}
exports.getDefaultScreenSeatSetup = getDefaultScreenSeatSetup;
function getCategorySeatCount(cat) {
    let seatCout = 0;
    for (const row of Object.values(cat.seats)) {
        seatCout += row.filter((x) => x !== 0).length;
    }
    return seatCout;
}
exports.getCategorySeatCount = getCategorySeatCount;
function getSeatCount(screenSeat) {
    return (getCategorySeatCount(screenSeat.diamond) +
        getCategorySeatCount(screenSeat.gold) +
        getCategorySeatCount(screenSeat.silver));
}
exports.getSeatCount = getSeatCount;
function getRowKeys(category) {
    return Object.keys(category.seats);
}
exports.getRowKeys = getRowKeys;
function getLastRow(screenSeat) {
    const diamondKeys = getRowKeys(screenSeat.diamond);
    const goldKeys = getRowKeys(screenSeat.gold);
    const silverKeys = getRowKeys(screenSeat.silver);
    if (silverKeys.length !== 0) {
        return silverKeys[silverKeys.length - 1];
    }
    else if (goldKeys.length !== 0) {
        return goldKeys[goldKeys.length - 1];
    }
    else {
        return diamondKeys[diamondKeys.length - 1];
    }
}
exports.getLastRow = getLastRow;
function getAvailSeatData(cat) {
    (0, console_1.log)(cat, 'cat from getAvailSeatData');
    if (cat.seats.size > 0) {
        (0, console_1.log)('returning name', cat.name);
        return cat.name;
    }
    else {
        (0, console_1.log)('returning undefined');
        return undefined;
    }
}
exports.getAvailSeatData = getAvailSeatData;
