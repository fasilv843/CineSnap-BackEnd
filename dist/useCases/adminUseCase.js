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
const httpStausCodes_1 = require("../constants/httpStausCodes");
class AdminUseCase {
    constructor(encrypt, adminRepository, jwtToken) {
        this.encrypt = encrypt;
        this.adminRepository = adminRepository;
        this.jwtToken = jwtToken;
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.adminRepository.findAdmin();
            if (adminData !== null) {
                const passwordMatch = yield this.encrypt.comparePasswords(password, adminData.password);
                if (passwordMatch) {
                    const accessToken = this.jwtToken.generateAccessToken(adminData._id);
                    const refreshToken = this.jwtToken.generateRefreshToken(adminData._id);
                    return {
                        status: httpStausCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: adminData,
                        accessToken,
                        refreshToken
                    };
                }
                else {
                    return {
                        status: httpStausCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'Invalid Email or Password',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    };
                }
            }
            else {
                return {
                    status: httpStausCodes_1.STATUS_CODES.UNAUTHORIZED,
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
