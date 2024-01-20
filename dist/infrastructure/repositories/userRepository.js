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
exports.UserRepository = void 0;
const console_1 = require("console");
const userModel_1 = __importDefault(require("../../entities/models/userModel"));
class UserRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('on user repository saving user');
            return yield new userModel_1.default(user).save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById({ _id: id });
        });
    }
    findUserCoupons(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById({ _id: userId }, { _id: 0, usedCoupons: 1 });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOne({ email });
        });
    }
    findAllUsers(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, 'i');
            return yield userModel_1.default.find({
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                    { mobile: { $regex: regex } }
                ]
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-password')
                .exec();
        });
    }
    findUserCount(searchQuery = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, 'i');
            return yield userModel_1.default.find({
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                    { mobile: { $regex: regex } }
                ]
            }).count();
        });
    }
    updateGoogleAuth(id, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findById({ _id: id });
                if (userData) {
                    userData.isGoogleAuth = true;
                    if (!userData.profilePic)
                        userData.profilePic = profilePic;
                    yield userData.save();
                }
            }
            catch (error) {
                console.log(error);
                throw Error('Error while updating google auth');
            }
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById({ _id: userId });
                if (user !== null) {
                    user.isBlocked = !user.isBlocked;
                    yield user.save();
                }
                else {
                    throw Error('Something went wrong, userId didt received');
                }
            }
            catch (error) {
                throw Error('Error while blocking/unblocking user');
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findById(userId);
        });
    }
    updateUser(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                name: user.name,
                mobile: user.mobile,
                dob: user.dob,
                address: user.address,
                coords: user.coords
            }, { new: true });
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $set: {
                    profilePic: fileName
                }
            }, { new: true });
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $unset: {
                    profilePic: ''
                }
            }, { new: true });
        });
    }
    updateWallet(userId, amount, message) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, console_1.log)(userId, 'userID from update wallet of user');
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount, message } }
            }, { new: true });
        });
    }
    getWalletHistory(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findById({ _id: userId });
            return userData !== null
                ? {
                    walletHistory: userData.walletHistory.slice((page - 1) * limit, page * limit),
                    count: userData.walletHistory.length
                }
                : null;
        });
    }
    addToUsedCoupons(userId, couponId, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findByIdAndUpdate({ _id: userId }, {
                $push: {
                    usedCoupons: { couponId, ticketId }
                }
            }, { new: true });
        });
    }
}
exports.UserRepository = UserRepository;
