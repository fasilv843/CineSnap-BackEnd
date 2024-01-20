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
exports.ShowUseCase = void 0;
const console_1 = require("console");
const httpStausCodes_1 = require("../constants/httpStausCodes");
const date_1 = require("../infrastructure/helperFunctions/date");
const getMovieEnding_1 = require("../infrastructure/helperFunctions/getMovieEnding");
const response_1 = require("../infrastructure/helperFunctions/response");
const showSeat_1 = require("../infrastructure/helperFunctions/showSeat");
class ShowUseCase {
    constructor(showRepository, movieRepository, screenRepository, screenSeatRepository, showSeatRepository) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.screenSeatRepository = screenSeatRepository;
        this.showSeatRepository = showSeatRepository;
    }
    findShowsOnTheater(theaterId, dateStr, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(dateStr === undefined, isNaN(new Date(dateStr).getTime()), (user === 'User' && (0, date_1.isPast)(new Date(dateStr))));
                if (dateStr === undefined || isNaN(new Date(dateStr).getTime()) || (user === 'User' && (0, date_1.isPast)(new Date(dateStr)))) {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Date is not available or invalid');
                }
                else {
                    const date = new Date(dateStr);
                    let from = new Date(date);
                    from.setHours(0, 0, 0, 0);
                    if (user === 'User' && (0, date_1.isToday)(from)) {
                        from = new Date();
                    }
                    const to = new Date(date);
                    to.setHours(23, 59, 59, 999);
                    // console.log(typeof date, 'type from usecase')
                    const shows = yield this.showRepository.findShowsOnDate(theaterId, from, to);
                    return (0, response_1.get200Response)(shows);
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    addShow(show) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(show, 'show data from use case');
                // console.log(show.movieId, show.screenId, show.startTime);
                if (!show.movieId || !show.screenId || !show.startTime) {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing');
                }
                const movie = yield this.movieRepository.findMovieById(show.movieId);
                if (movie !== null) {
                    const endingTime = (0, getMovieEnding_1.getEndingTime)(show.startTime, movie.duration);
                    const collidedShows = yield this.showRepository.getCollidingShowsOnTheScreen(show.screenId, show.startTime, endingTime);
                    if (collidedShows.length === 0) {
                        const screen = yield this.screenRepository.findScreenById(show.screenId);
                        if (screen) {
                            const screenSeat = yield this.screenSeatRepository.findScreenSeatById(screen.seatId);
                            if (screenSeat) {
                                const showSeatToSave = (0, showSeat_1.createEmptyShowSeat)(screenSeat);
                                const savedShowSeat = yield this.showSeatRepository.saveShowSeat(showSeatToSave);
                                const showTosave = {
                                    movieId: movie._id,
                                    screenId: screen._id,
                                    startTime: new Date(show.startTime),
                                    endTime: endingTime,
                                    totalSeatCount: screen.seatsCount,
                                    availableSeatCount: screen.seatsCount,
                                    seatId: savedShowSeat._id
                                };
                                const savedShow = yield this.showRepository.saveShow(showTosave);
                                return (0, response_1.get200Response)(savedShow);
                            }
                            else {
                                return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing');
                            }
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing');
                        }
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.CONFLICT, 'Show already exists at the same time.');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid movie id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getShowDetails(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (showId) {
                    const show = yield this.showRepository.getShowDetails(showId);
                    if (show !== null)
                        return (0, response_1.get200Response)(show);
                    else
                        return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Show does not exist on requested Id');
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'showId is not availble');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ShowUseCase = ShowUseCase;
