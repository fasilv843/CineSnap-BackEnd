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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenUseCase = void 0;
const httpStausCodes_1 = require("../constants/httpStausCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const getScreenSeat_1 = require("../infrastructure/helperFunctions/getScreenSeat");
const mongoose_1 = __importDefault(require("mongoose"));
const console_1 = require("console");
class ScreenUseCase {
    constructor(screenRepository, screenSeatRepository, theaterRepository) {
        this.screenRepository = screenRepository;
        this.screenSeatRepository = screenSeatRepository;
        this.theaterRepository = theaterRepository;
    }
    saveScreenDetails(screen) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows, cols, name, theaterId } = screen;
                const rowCount = rows.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
                const defaultScreenSeats = (0, getScreenSeat_1.getDefaultScreenSeatSetup)(rows, cols);
                const session = yield mongoose_1.default.connection.startSession();
                try {
                    let savedScreen = null;
                    yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                        // saving screen seat data
                        const savedScreenSeat = yield this.screenSeatRepository.saveScreenSeat(defaultScreenSeats);
                        // Saving Screen
                        const screenData = {
                            theaterId, name, rows, cols,
                            seatsCount: rowCount * cols,
                            seatId: savedScreenSeat._id
                        };
                        savedScreen = yield this.screenRepository.saveScreen(screenData);
                        // updating seat count in theater data
                        yield this.theaterRepository.updateScreenCount(theaterId, 1);
                    }));
                    yield session.commitTransaction();
                    (0, console_1.log)(savedScreen, 'saved screen from saveScreen Use Case');
                    return (0, response_1.get200Response)(savedScreen);
                }
                catch (error) {
                    session.abortTransaction();
                    return (0, response_1.get500Response)(error);
                }
                finally {
                    session.endSession();
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findScreenById(screenId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screen = yield this.screenRepository.findScreenById(screenId);
                if (screen)
                    return (0, response_1.get200Response)(screen);
                else
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findScreensInTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screens = yield this.screenRepository.findScreensInTheater(theaterId);
                return (0, response_1.get200Response)(screens);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateScreenName(screenId, screenName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screen = yield this.screenRepository.updateScreenName(screenId, screenName);
                if (screen)
                    return (0, response_1.get200Response)(screen);
                else
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    deleteScreen(screenId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screen = yield this.screenRepository.deleteScreen(screenId);
                if (screen) {
                    yield this.screenSeatRepository.deleteScreenSeat(screen.seatId);
                    yield this.theaterRepository.updateScreenCount(screen.theaterId, -1);
                    return (0, response_1.get200Response)(null);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid Request');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getAvailSeatsOnScreen(screenId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screen = yield this.screenRepository.findScreenById(screenId);
                if (screen) {
                    const screenSeat = yield this.screenSeatRepository.findScreenSeatById(screen.seatId);
                    if (screenSeat) {
                        const { diamond, gold, silver } = screenSeat;
                        return (0, response_1.get200Response)({
                            diamond: (0, getScreenSeat_1.getAvailSeatData)(diamond),
                            gold: (0, getScreenSeat_1.getAvailSeatData)(gold),
                            silver: (0, getScreenSeat_1.getAvailSeatData)(silver),
                        });
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong while fetching seat data');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid Screen Id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ScreenUseCase = ScreenUseCase;
