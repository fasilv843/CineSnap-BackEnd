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
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const date_1 = require("../../infrastructure/helperFunctions/date");
const getMovieEnding_1 = require("../../infrastructure/helperFunctions/getMovieEnding");
const response_1 = require("../../infrastructure/helperFunctions/response");
const showSeat_1 = require("../../infrastructure/helperFunctions/showSeat");
class ShowUseCase {
    constructor(_showRepository, _movieRepository, _screenRepository, _screenSeatRepository, _showSeatRepository) {
        this._showRepository = _showRepository;
        this._movieRepository = _movieRepository;
        this._screenRepository = _screenRepository;
        this._screenSeatRepository = _screenSeatRepository;
        this._showSeatRepository = _showSeatRepository;
    }
    findShowsOnTheater(theaterId, dateStr, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(dateStr === undefined, isNaN(new Date(dateStr).getTime()), (user === 'User' && (0, date_1.isPast)(new Date(dateStr))));
                if (dateStr === undefined || isNaN(new Date(dateStr).getTime()) || (user === 'User' && (0, date_1.isPast)(new Date(dateStr)))) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Date is not available or invalid');
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
                    const shows = yield this._showRepository.findShowsOnDate(theaterId, from, to);
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
                if (!show.movieId || !show.screenId || !show.startTime) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing');
                }
                const movie = yield this._movieRepository.findMovieById(show.movieId);
                if (movie !== null) {
                    const endingTime = (0, getMovieEnding_1.getEndingTime)(show.startTime, movie.duration);
                    const collidedShows = yield this._showRepository.getCollidingShowsOnTheScreen(show.screenId, show.startTime, endingTime);
                    if (collidedShows.length === 0) {
                        const screen = yield this._screenRepository.findScreenById(show.screenId);
                        if (screen) {
                            const screenSeat = yield this._screenSeatRepository.findScreenSeatById(screen.seatId);
                            if (screenSeat) {
                                const showSeatToSave = (0, showSeat_1.createEmptyShowSeat)(screenSeat);
                                const savedShowSeat = yield this._showSeatRepository.saveShowSeat(showSeatToSave);
                                const showTosave = {
                                    movieId: movie._id,
                                    screenId: screen._id,
                                    startTime: new Date(show.startTime),
                                    endTime: endingTime,
                                    totalSeatCount: screen.seatsCount,
                                    availableSeatCount: screen.seatsCount,
                                    seatId: savedShowSeat._id
                                };
                                const savedShow = yield this._showRepository.saveShow(showTosave);
                                return (0, response_1.get200Response)(savedShow);
                            }
                            else {
                                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing');
                            }
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing');
                        }
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.CONFLICT, 'Show already exists at the same time.');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid movie id');
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
                    const show = yield this._showRepository.getShowDetails(showId);
                    if (show !== null)
                        return (0, response_1.get200Response)(show);
                    else
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Show does not exist on requested Id');
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'showId is not availble');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ShowUseCase = ShowUseCase;
