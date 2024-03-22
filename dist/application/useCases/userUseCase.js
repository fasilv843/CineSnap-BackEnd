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
exports.UserUseCase = void 0;
const console_1 = require("console");
const constants_1 = require("../../infrastructure/constants/constants");
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const response_1 = require("../../infrastructure/helperFunctions/response");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class UserUseCase {
    constructor(_userRepository, _tempUserRepository, _encryptor, _tokenGenerator, _mailer) {
        this._userRepository = _userRepository;
        this._tempUserRepository = _tempUserRepository;
        this._encryptor = _encryptor;
        this._tokenGenerator = _tokenGenerator;
        this._mailer = _mailer;
    }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this._userRepository.findByEmail(email);
            return isUserExist;
        });
    }
    saveUserDetails(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.saveUser(userData);
            // console.log('user data saved, on usecase', user);
            const accessToken = this._tokenGenerator.generateAccessToken(user._id);
            const refreshToken = this._tokenGenerator.generateRefreshToken(user._id);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: user,
                message: 'Success',
                accessToken,
                refreshToken
            };
        });
    }
    saveUserTemporarily(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._tempUserRepository.saveUser(userData);
            // console.log(user, 'temp user saved');
            const userAuthToken = this._tokenGenerator.generateTempToken(user._id);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(user))), { userAuthToken });
        });
    }
    updateOtp(id, email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._tempUserRepository.updateOTP(id, email, OTP);
        });
    }
    findTempUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._tempUserRepository.findById(id);
        });
    }
    handleSocialSignUp(name, email, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailData = yield this.isEmailExist(email);
            if (emailData === null) {
                const userToSave = { name, email, profilePic, isGoogleAuth: true };
                const savedData = yield this.saveUserDetails(userToSave);
                console.log('user details saved');
                return savedData;
            }
            else {
                if (emailData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: 'You are blocked by admin',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
                else {
                    if (!emailData.isGoogleAuth) {
                        yield this._userRepository.updateGoogleAuth(emailData._id, profilePic);
                    }
                    const accessToken = this._tokenGenerator.generateAccessToken(emailData._id);
                    const refreshToken = this._tokenGenerator.generateRefreshToken(emailData._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: emailData,
                        accessToken,
                        refreshToken
                    };
                }
            }
        });
    }
    // To send an otp to user that will expire after a certain period
    sendTimeoutOTP(id, email, OTP) {
        try {
            this._mailer.sendOTP(email, OTP);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this._tempUserRepository.unsetOtp(id, email);
            }), constants_1.OTP_TIMER);
        }
        catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp');
        }
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this._userRepository.findByEmail(email);
            if (userData !== null) {
                if (userData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: 'You are blocked by admin',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
                else {
                    const passwordMatch = yield this._encryptor.comparePasswords(password, userData.password);
                    if (passwordMatch) {
                        const accessToken = this._tokenGenerator.generateAccessToken(userData._id);
                        const refreshToken = this._tokenGenerator.generateRefreshToken(userData._id);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: 'Success',
                            data: userData,
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
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid email or password!',
                data: null,
                accessToken: '',
                refreshToken: ''
            };
        });
    }
    getAllUsers(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = '';
                const users = yield this._userRepository.findAllUsers(page, limit, searchQuery);
                const userCount = yield this._userRepository.findUserCount(searchQuery);
                return (0, response_1.get200Response)({ users, userCount });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._userRepository.blockUnblockUser(userId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.getUserData(userId);
                if (user)
                    return (0, response_1.get200Response)(user);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserData(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this._userRepository.updateUser(userId, user);
                return (0, response_1.get200Response)(updatedUser);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                (0, console_1.log)(userId, fileName, 'userId, filename from use case');
                const user = yield this._userRepository.findById(userId);
                // Deleting user dp if it already exist
                if (user && user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${user.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedUser = yield this._userRepository.updateUserProfilePic(userId, fileName);
                if (updatedUser)
                    return (0, response_1.get200Response)(updatedUser);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findById(userId);
                if (!user)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
                // Deleting user dp if it already exist
                if (user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../images/${user.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedUser = yield this._userRepository.removeUserProfileDp(userId);
                if (updatedUser) {
                    return (0, response_1.get200Response)(updatedUser);
                }
                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    addToWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof amount !== 'number')
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number');
                const user = yield this._userRepository.updateWallet(userId, amount, 'Added To Wallet');
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
    getWalletHistory(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWallet = yield this._userRepository.getWalletHistory(userId, page, limit);
                if (userWallet)
                    return (0, response_1.get200Response)(userWallet);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userid');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
