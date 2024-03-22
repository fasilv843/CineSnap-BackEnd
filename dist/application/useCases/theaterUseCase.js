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
exports.TheaterUseCase = void 0;
const console_1 = require("console");
const constants_1 = require("../../infrastructure/constants/constants");
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const response_1 = require("../../infrastructure/helperFunctions/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const calculateTheaterShare_1 = require("../../infrastructure/helperFunctions/calculateTheaterShare");
const dashboardHelpers_1 = require("../../infrastructure/helperFunctions/dashboardHelpers");
class TheaterUseCase {
    constructor(_theaterRepository, _tempTheaterRepository, _ticketRepository, _encryptor, _tokenGenerator, _mailer, _otpGenerator) {
        this._theaterRepository = _theaterRepository;
        this._tempTheaterRepository = _tempTheaterRepository;
        this._ticketRepository = _ticketRepository;
        this._encryptor = _encryptor;
        this._tokenGenerator = _tokenGenerator;
        this._mailer = _mailer;
        this._otpGenerator = _otpGenerator;
    }
    verifyAndSaveTemporarily(theaterData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmailExist = yield this.isEmailExist(theaterData.email);
                if (isEmailExist) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.FORBIDDEN, 'Email Already Exist');
                }
                else {
                    theaterData.otp = this._otpGenerator.generateOTP();
                    theaterData.password = yield this._encryptor.encryptPassword(theaterData.password);
                    const tempTheater = yield this._tempTheaterRepository.saveTheater(theaterData);
                    this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp);
                    const userAuthToken = this._tokenGenerator.generateTempToken(tempTheater._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: tempTheater,
                        token: userAuthToken
                    };
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To send an otp to mail,and delete after spcified time (OTP_TIMER)
    sendTimeoutOTP(id, email, OTP) {
        console.log(OTP, 'otp from sendTimeoutOTP');
        this._mailer.sendOTP(email, OTP);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield this._tempTheaterRepository.unsetTheaterOTP(id, email);
        }), constants_1.OTP_TIMER);
    }
    verifyAndSendNewOTP(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (authToken) {
                    const decoded = jsonwebtoken_1.default.verify(authToken.slice(7), process.env.JWT_SECRET_KEY);
                    const tempTheater = yield this._tempTheaterRepository.findTempTheaterById(decoded.id);
                    if (tempTheater) {
                        const newOTP = this._otpGenerator.generateOTP();
                        yield this._tempTheaterRepository.updateTheaterOTP(tempTheater._id, tempTheater.email, newOTP);
                        this.sendTimeoutOTP(tempTheater._id, tempTheater.email, newOTP);
                        return (0, response_1.get200Response)(null);
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Unautherized');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Token in missing');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    validateAndSaveTheater(authToken, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (authToken) {
                    const decoded = jsonwebtoken_1.default.verify(authToken.slice(7), process.env.JWT_SECRET_KEY);
                    const theater = yield this._tempTheaterRepository.findTempTheaterById(decoded.id);
                    if (theater) {
                        if (otp == theater.otp) {
                            const savedTheater = yield this._theaterRepository.saveTheater(theater);
                            const accessToken = this._tokenGenerator.generateAccessToken(savedTheater._id);
                            const refreshToken = this._tokenGenerator.generateRefreshToken(savedTheater._id);
                            return {
                                status: httpStatusCodes_1.STATUS_CODES.OK,
                                message: 'Success',
                                data: savedTheater,
                                accessToken,
                                refreshToken
                            };
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Incorrect OTP');
                        }
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Unautherized');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Token is Missing');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // async saveTheater(theaterData: ITheater): Promise<ITheater> {
    //     return await this._theaterRepository.saveTheater(theaterData)
    // }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this._theaterRepository.findByEmail(email);
            return Boolean(isUserExist);
        });
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterData = yield this._theaterRepository.findByEmail(email);
            if (theaterData !== null) {
                if (theaterData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: 'You have been blocked by admin',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
                const passwordMatch = yield this._encryptor.comparePasswords(password, theaterData.password);
                if (passwordMatch) {
                    const accessToken = this._tokenGenerator.generateAccessToken(theaterData._id);
                    const refreshToken = this._tokenGenerator.generateRefreshToken(theaterData._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: theaterData,
                        accessToken,
                        refreshToken
                    };
                }
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'Incorrect Password',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
            }
            else {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email',
                    data: null,
                    accessToken: '',
                    refreshToken: ''
                };
            }
        });
    }
    // To get all theaters
    getAllTheaters(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = '';
                const theaters = yield this._theaterRepository.findAllTheaters(page, limit, searchQuery);
                const theaterCount = yield this._theaterRepository.findTheaterCount(searchQuery);
                return (0, response_1.get200Response)({ theaters, theaterCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To Block Theater
    blockTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._theaterRepository.blockTheater(theaterId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // Returns Every theaters within a radius
    getNearestTheaters(lon, lat, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._theaterRepository.getNearestTheaters(lon, lat, radius);
        });
    }
    // Returns theaters within radius maxDistance, and limit count
    getNearestTheatersByLimit(lon, lat, limit, maxDistance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._theaterRepository.getNearestTheatersByLimit(lon, lat, limit, maxDistance);
        });
    }
    // To update theater data, from theater profile
    updateTheater(theaterId, theater) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theaterData = yield this._theaterRepository.updateTheater(theaterId, theater);
                if (theaterData !== null) {
                    return (0, response_1.get200Response)(theaterData);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, theaterId is not availble');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To get theater data using theaterId
    getTheaterData(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (theaterId === undefined)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                const theater = yield this._theaterRepository.findById(theaterId);
                if (theater === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                return (0, response_1.get200Response)(theater);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To approve or reject theater for admin when they register
    theaterApproval(theaterId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (action !== 'approve' && action !== 'reject') {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                if (action === 'approve') {
                    const theater = yield this._theaterRepository.approveTheater(theaterId);
                    if (theater)
                        return (0, response_1.get200Response)(theater);
                    else
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                else {
                    const theater = yield this._theaterRepository.rejectTheater(theaterId);
                    if (theater)
                        return (0, response_1.get200Response)(theater);
                    else
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To update theater profile pic
    updateTheaterProfilePic(theaterId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                (0, console_1.log)(theaterId, fileName, 'theaterId, filename from use case');
                const theater = yield this._theaterRepository.findById(theaterId);
                // Deleting theater dp if it already exist
                if (theater && theater.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${theater.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedTheater = yield this._theaterRepository.updateTheaterProfilePic(theaterId, fileName);
                if (updatedTheater)
                    return (0, response_1.get200Response)(updatedTheater);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To delete Theater Profile
    removeTheaterProfilePic(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._theaterRepository.findById(theaterId);
                if (!user)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
                // Deleting user dp if it already exist
                if (user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${user.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedTheater = yield this._theaterRepository.removeTheaterProfilePic(theaterId);
                if (updatedTheater) {
                    return (0, response_1.get200Response)(updatedTheater);
                }
                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To add money to wallet
    addToWallet(theaterId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof amount !== 'number')
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number');
                const user = yield this._theaterRepository.updateWallet(theaterId, amount, 'Added To Wallet');
                if (user !== null)
                    return (0, response_1.get200Response)(user);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To get wallet history of a theater
    getWalletHistory(theaterId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWallet = yield this._theaterRepository.getWalletHistory(theaterId, page, limit);
                if (userWallet)
                    return (0, response_1.get200Response)(userWallet);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid theaterId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To get revenue data, to show graph
    getRevenueData(theaterId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (startDate === undefined || endDate === undefined) {
                    startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, // Go back one month
                    new Date().getDate() // Keep the same day of the month
                    );
                    endDate = new Date();
                }
                const ticketsOfTheater = yield this._ticketRepository.getTicketsOfTheaterByTime(theaterId, startDate, endDate);
                (0, console_1.log)(ticketsOfTheater, 'tickets to handle in get revenue use case');
                const addedAmt = {};
                ticketsOfTheater.forEach(tkt => {
                    const dateKey = (0, dashboardHelpers_1.getDateKeyWithInterval)(startDate, endDate, tkt.startTime);
                    if (!addedAmt[dateKey]) {
                        addedAmt[dateKey] = 0;
                    }
                    addedAmt[dateKey] += (0, calculateTheaterShare_1.calculateTheaterShare)(tkt);
                });
                const labels = Object.keys(addedAmt);
                const data = Object.values(addedAmt);
                return (0, response_1.get200Response)({ labels, data });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.TheaterUseCase = TheaterUseCase;
