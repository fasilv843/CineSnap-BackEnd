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
const screensModel_1 = require("../../entities/models/screensModel");
const showModel_1 = require("../../entities/models/showModel");
class ShowRepository {
    // async saveShowOld(show: IShowRequirements): Promise<IShow> {
    //     const movie = await movieModel.findById(show.movieId) as IMovie
    //     const screen = await screenModel.findById(show.screenId) as IScreen
    //     if (screen !== null || movie !== null) {
    //         const showSeat: Map<string, Array<IShowSeat>> = new Map()
    //         for (const row of screen.seats.keys()) {
    //             const rowArr = screen.seats.get(row)?.map(col => ({ col, isBooked: false })) || [];
    //             showSeat.set(row, rowArr)
    //         }
    //         const startTime = new Date(show.startTime);
    //         // console.log(startTime, 'show start time');
    //         const endTime = new Date(startTime);
    //         endTime.setHours(startTime.getHours() + movie.duration.hours);
    //         endTime.setMinutes(startTime.getMinutes() + movie.duration.minutes);
    //         // const ticketPrice: number = show.ticketPrice
    //         const showTosave: Omit<IShow, '_id'> = {
    //             movieId: show.movieId,
    //             screenId: show.screenId,
    //             startTime: show.startTime,
    //             endTime,
    //             // ticketPrice,
    //             seats: showSeat,
    //             totalSeatCount: screen.seatsCount,
    //             availableSeatCount: screen.seatsCount
    //         }
    //         return await new showModel(showTosave).save()
    //     } else {
    //         throw Error('screen or movie id is not available')
    //     }
    // }
    saveShow(showTosave) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new showModel_1.showModel(showTosave).save();
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
                            { startTime: { $lte: startTime } },
                            { endTime: { $gte: startTime } } // Existing show ends after or at the same time as the new show starts
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $lte: endTime } },
                            { endTime: { $gte: endTime } } // Existing show ends after or at the same time as the new show ends
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $gte: startTime } },
                            { endTime: { $lte: endTime } } // Existing show ends before or at the same time as the new show ends
                        ]
                    }
                ]
            });
        });
    }
}
exports.ShowRepository = ShowRepository;
