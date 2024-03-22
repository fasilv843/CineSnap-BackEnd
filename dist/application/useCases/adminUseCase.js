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
exports.AdminUseCase = void 0;
// import { AuthRes } from "../Types/AuthRes";
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
class AdminUseCase {
    constructor(_encryptor, _adminRepository, _tokenGenerator) {
        this._encryptor = _encryptor;
        this._adminRepository = _adminRepository;
        this._tokenGenerator = _tokenGenerator;
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this._adminRepository.findAdmin();
            if (adminData !== null) {
                const passwordMatch = yield this._encryptor.comparePasswords(password, adminData.password);
                if (passwordMatch) {
                    const accessToken = this._tokenGenerator.generateAccessToken(adminData._id);
                    const refreshToken = this._tokenGenerator.generateRefreshToken(adminData._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: adminData,
                        accessToken,
                        refreshToken
                    };
                }
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'Invalid Email or Password',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
            }
            else {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email or Password',
                    data: null,
                    accessToken: '',
                    refreshToken: ''
                };
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
