"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatMap = void 0;
function getSeatMap(seats) {
    var _a;
    const seatsMap = new Map();
    for (const seat of seats) {
        if (seatsMap.get(seat.row) !== undefined) {
            (_a = seatsMap.get(seat.row)) === null || _a === void 0 ? void 0 : _a.push(seat.col);
        }
        else {
            seatsMap.set(seat.row, [seat.col]);
        }
    }
    // console.log(seatsMap, 'seatsMap from getSeatmap method')
    return seatsMap;
}
exports.getSeatMap = getSeatMap;
