"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowSeatsRepository = void 0;
const console_1 = require("console");
const showSeatModel_1 = require("../../entities/models/showSeatModel");
class ShowSeatsRepository {
    // Save new seat document for each show newly created
    saveShowSeat(showSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new showSeatModel_1.showSeatsModel(showSeat).save();
        });
    }
    // To get the document using _id
    findShowSeatById(showSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showSeatModel_1.showSeatsModel.findById(showSeatId);
        });
    }
    // To Change isBooked to true, when someone books a show
    markAsBooked(seatId, diamondSeats, goldSeats, silverSeats) {
        return __awaiter(this, void 0, void 0, function* () {
            const showSeats = yield showSeatModel_1.showSeatsModel.findById(seatId);
            if (showSeats === null)
                return null;
            (0, console_1.log)(showSeats, 'showSeats from markAsRead');
            (0, console_1.log)(diamondSeats, 'diamondSeats');
            (0, console_1.log)(goldSeats, 'goldSeats');
            (0, console_1.log)(silverSeats, 'silverSeats');
            if (diamondSeats) {
                diamondSeats.seats.forEach(s => {
                    const row = s[0];
                    const col = parseInt(s.slice(1));
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.diamond.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s);
                        showSeats.diamond.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            if (goldSeats) {
                goldSeats.seats.forEach(s => {
                    const row = s[0];
                    const col = parseInt(s.slice(1));
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.gold.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s);
                        showSeats.gold.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            if (silverSeats) {
                silverSeats.seats.forEach(s => {
                    const row = s[0];
                    const col = parseInt(s.slice(1));
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.silver.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: true } : s);
                        showSeats.silver.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            return yield showSeats.save();
        });
    }
    // To Change isBooked to false, when someone cancels a show
    markAsNotBooked(seatId, diamondSeats, goldSeats, silverSeats) {
        return __awaiter(this, void 0, void 0, function* () {
            const showSeats = yield showSeatModel_1.showSeatsModel.findById(seatId);
            if (showSeats === null)
                return null;
            (0, console_1.log)(showSeats, 'showSeats from markAsRead');
            (0, console_1.log)(diamondSeats, 'diamondSeats');
            (0, console_1.log)(goldSeats, 'goldSeats');
            (0, console_1.log)(silverSeats, 'silverSeats');
            if (diamondSeats) {
                diamondSeats.seats.forEach(s => {
                    const row = s[0];
                    const col = parseInt(s.slice(1));
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.diamond.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s);
                        showSeats.diamond.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            if (goldSeats) {
                goldSeats.seats.forEach(s => {
                    const row = s[0];
                    const col = parseInt(s.slice(1));
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.gold.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s);
                        showSeats.gold.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            if (silverSeats) {
                silverSeats.seats.forEach(s => {
                    const col = parseInt(s.slice(1));
                    const row = s[0];
                    (0, console_1.log)(col, 'col'), (0, console_1.log)(row, 'row');
                    const rowArr = showSeats.silver.seats.get(row);
                    if (rowArr) {
                        const updatedRowArr = rowArr.map(s => s.col === col ? { col: col, isBooked: false } : s);
                        showSeats.silver.seats.set(row, updatedRowArr);
                    }
                    (0, console_1.log)(rowArr, 'rowArr');
                });
            }
            return yield showSeats.save();
        });
    }
}
exports.ShowSeatsRepository = ShowSeatsRepository;
