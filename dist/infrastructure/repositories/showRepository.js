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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowRepository = void 0;
const screensModel_1 = require("../db/screensModel");
const showModel_1 = require("../db/showModel");
class ShowRepository {
    saveShow(showToSave) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new showModel_1.showModel(showToSave).save();
        });
    }
    findShowsOnDate(theaterId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Find screens that match the theaterId
            const screens = yield screensModel_1.screenModel.find({ theaterId });
            // Step 2: Get shows for each screen within the specified time range
            const showsPromises = screens.map((screen) => __awaiter(this, void 0, void 0, function* () {
                const screenShows = yield showModel_1.showModel.find({
                    screenId: screen._id,
                    startTime: { $gte: from, $lte: to }
                }).populate('movieId');
                const movieShowsMap = screenShows.reduce((acc, screen) => {
                    const _a = JSON.parse(JSON.stringify(screen)), { movieId } = _a, rest = __rest(_a, ["movieId"]);
                    const movie = movieId;
                    if (!acc[movie._id]) {
                        acc[movie._id] = {
                            movieId: movie,
                            shows: []
                        };
                    }
                    acc[movie._id].shows.push(rest);
                    return acc;
                }, {});
                const movieShows = Object.values(movieShowsMap);
                return {
                    screenId: screen._id,
                    screenName: screen.name,
                    shows: movieShows
                };
            }));
            // Step 3: Wait for all show queries to complete
            return yield Promise.all(showsPromises);
        });
    }
    getShowDetails(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findById(showId).populate('movieId');
        });
    }
    getCollidingShowsOnTheScreen(screenId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.find({
                screenId,
                $or: [
                    {
                        $and: [
                            { startTime: { $lte: startTime } }, // Existing show starts before or at the same time as the new show
                            { endTime: { $gte: startTime } } // Existing show ends after or at the same time as the new show starts
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $lte: endTime } }, // Existing show starts before or at the same time as the new show ends
                            { endTime: { $gte: endTime } } // Existing show ends after or at the same time as the new show ends
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $gte: startTime } }, // Existing show starts after or at the same time as the new show starts
                            { endTime: { $lte: endTime } } // Existing show ends before or at the same time as the new show ends
                        ]
                    }
                ]
            });
        });
    }
}
exports.ShowRepository = ShowRepository;
