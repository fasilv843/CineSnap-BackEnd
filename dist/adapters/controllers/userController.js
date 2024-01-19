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
exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStausCodes_1 = require("../../constants/httpStausCodes");
class UserController {
    constructor(userUseCase, otpGenerator, encrypt) {
        this.userUseCase = userUseCase;
        this.otpGenerator = otpGenerator;
        this.encrypt = encrypt;
    }
    userRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                // console.log(name, email, password);
                const isEmailExist = yield this.userUseCase.isEmailExist(email);
                if (isEmailExist === null) {
                    const OTP = this.otpGenerator.generateOTP();
                    // console.log(OTP,'OTP');
                    const securePassword = yield this.encrypt.encryptPassword(password);
                    const user = { name, email, password: securePassword, otp: OTP };
                    const tempUser = yield this.userUseCase.saveUserTemporarily(user);
                    this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP);
                    // console.log('responding with 200');
                    res.status(httpStausCodes_1.STATUS_CODES.OK).json({ message: 'Success', token: tempUser.userAuthToken });
                }
                else {
                    res.status(httpStausCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Email already Exist" });
                }
            }
            catch (error) {
                console.log(error);
                console.log('error while register');
            }
        });
    }
    validateUserOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('validating otp');
                console.log(req.body.otp, 'req.body.otp');
                const { otp } = req.body;
                const authToken = req.headers.authorization;
                // console.log(authToken, 'authToken from validate otp');
                if (authToken) {
                    const decoded = jsonwebtoken_1.default.verify(authToken.slice(7), process.env.JWT_SECRET_KEY);
                    const user = yield this.userUseCase.findTempUserById(decoded.id);
                    if (user) {
                        if (otp == user.otp) {
                            const savedData = yield this.userUseCase.saveUserDetails({
                                name: user.name,
                                email: user.email,
                                password: user.password
                            });
                            console.log('user details saved, setting status 200');
                            res.status(savedData.status).json(savedData);
                        }
                        else {
                            console.log('otp didnt match');
                            res.status(httpStausCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid OTP' });
                        }
                    }
                    else {
                        res.status(httpStausCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'Timeout, Register again' });
                    }
                }
                else {
                    res.status(httpStausCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'authToken missing, Register again' });
                }
            }
            catch (error) {
                console.log(error);
                // next(error)
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authToken = req.headers.authorization;
                // console.log(authToken, 'authToken from resend otp');
                if (authToken) {
                    const decoded = jsonwebtoken_1.default.verify(authToken.slice(7), process.env.JWT_SECRET_KEY);
                    const tempUser = yield this.userUseCase.findTempUserById(decoded.id);
                    if (tempUser) {
                        const OTP = this.otpGenerator.generateOTP();
                        // console.log(tempUser, 'userData');
                        console.log(OTP, 'new resend otp');
                        yield this.userUseCase.updateOtp(tempUser._id, tempUser.email, OTP);
                        this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP);
                        res.status(httpStausCodes_1.STATUS_CODES.OK).json({ message: 'OTP has been sent' });
                    }
                    else {
                        res.status(httpStausCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'user timeout, register again' });
                    }
                }
                else {
                    res.status(httpStausCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'AuthToken missing' });
                }
            }
            catch (error) {
                const err = error;
                console.log(error);
                res.status(500).json({ message: err.message });
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const authData = yield this.userUseCase.verifyLogin(email, password);
                res.status(authData.status).json(authData);
            }
            catch (error) {
                console.log(error);
                // next(error)
            }
        });
    }
    userSocialSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, profilePic } = req.body;
                const authData = yield this.userUseCase.handleSocialSignUp(name, email, profilePic);
                res.status(authData.status).json(authData);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ message: err.message });
            }
        });
    }
    // to get user data using userId
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.getUserData(userId);
            res.json(apiRes.status).json(apiRes);
        });
    }
    // To update user details from profile
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.updateUserData(userId, user);
            res.status(apiRes.status).json(apiRes);
        });
    }
    updateUserProfileDp(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
            const apiRes = yield this.userUseCase.updateUserProfilePic(userId, fileName);
            res.status(apiRes.status).json(apiRes);
        });
    }
    removeUserProfileDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.removeUserProfileDp(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    addToWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const amount = parseInt(req.body.amount);
            const apiRes = yield this.userUseCase.addToWallet(userId, amount);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getWalletHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const page = req.query.page;
            const limit = req.query.limit;
            const apiRes = yield this.userUseCase.getWalletHistory(userId, page, limit);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.UserController = UserController;
