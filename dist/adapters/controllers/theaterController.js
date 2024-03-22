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
exports.TheaterController = void 0;
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const constants_1 = require("../../infrastructure/constants/constants");
class TheaterController {
    constructor(_theaterUseCase) {
        this._theaterUseCase = _theaterUseCase;
    }
    // To save non-verified theater data temporarily and send otp for verification
    theaterRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, liscenceId } = req.body;
            const { longitude, latitude } = req.body;
            const { country, state, district, city, zip, landmark } = req.body;
            const address = { country, state, district, city, zip, landmark };
            const coords = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
            // console.log(coords, 'coords');
            const theaterData = { name, email, liscenceId, password, address, coords, otp: 0 };
            const authRes = yield this._theaterUseCase.verifyAndSaveTemporarily(theaterData);
            res.status(authRes.status).json(authRes);
        });
    }
    // To validate otp during registration
    validateTheaterOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp } = req.body;
            const authToken = req.headers.authorization;
            const validationRes = yield this._theaterUseCase.validateAndSaveTheater(authToken, otp);
            res.status(validationRes.status).json(validationRes);
        });
    }
    // To resend otp if current one is already expired
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = req.headers.authorization;
            const apiRes = yield this._theaterUseCase.verifyAndSendNewOTP(authToken);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To authenticate theater login using email and password
    theaterLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const authData = yield this._theaterUseCase.verifyLogin(email, password);
            res.status(authData.status).json(authData);
        });
    }
    loadTheaters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const longitude = parseFloat(req.query.longitude);
                const latitude = parseFloat(req.query.latitude);
                // console.log('on load theateres controller', longitude, latitude);
                if (isNaN(longitude) || isNaN(latitude)) {
                    return res.status(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid coordinates' });
                }
                const nearestTheater = yield this._theaterUseCase.getNearestTheatersByLimit(longitude, latitude, constants_1.TheaterShowLimit, constants_1.maxDistance);
                // console.log(nearestTheater);
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ message: 'Success', data: nearestTheater });
            }
            catch (error) {
                const err = error;
                res.status(400).json({ messge: err.message });
            }
        });
    }
    // to update a theater data, used in profile edit
    updateTheaterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const { address, coords, mobile, name } = req.body;
            const theater = { name, mobile, address, coords };
            const apiRes = yield this._theaterUseCase.updateTheater(theaterId, theater);
            res.status(apiRes.status).json(apiRes);
        });
    }
    updateTheaterProfilePic(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
            const apiRes = yield this._theaterUseCase.updateTheaterProfilePic(theaterId, fileName);
            res.status(apiRes.status).json(apiRes);
        });
    }
    removeTheaterProfilePic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this._theaterUseCase.removeTheaterProfilePic(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To get all the data of a theater using theater id
    getTheaterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this._theaterUseCase.getTheaterData(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    addToWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { theaterId } = req.params;
            const amount = parseInt(req.body.amount);
            const apiRes = yield this._theaterUseCase.addToWallet(theaterId, amount);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getWalletHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { theaterId } = req.params;
            const page = req.query.page;
            const limit = req.query.limit;
            const apiRes = yield this._theaterUseCase.getWalletHistory(theaterId, page, limit);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getRevenueData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this._theaterUseCase.getRevenueData(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.TheaterController = TheaterController;
