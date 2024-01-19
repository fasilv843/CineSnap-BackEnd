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
exports.TheaterRepository = void 0;
const theaterModel_1 = require("../../entities/models/theaterModel");
class TheaterRepository {
    getNearestTheaters(lon, lat, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchLocation = {
                    type: 'Point',
                    coordinates: [lon, lat],
                };
                const theaters = yield theaterModel_1.theaterModel.find({
                    coords: {
                        $near: {
                            $geometry: searchLocation,
                            $maxDistance: radius,
                        },
                    },
                    approvalStatus: 'Approved'
                });
                return theaters;
            }
            catch (error) {
                console.log(error);
                throw Error('error while getting nearest theaters');
            }
        });
    }
    getNearestTheatersByLimit(lon, lat, limit, maxDistance) {
        return __awaiter(this, void 0, void 0, function* () {
            const nearestTheaters = yield theaterModel_1.theaterModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [lon, lat],
                        },
                        distanceField: 'distance',
                        spherical: true,
                        maxDistance: maxDistance * 1000 * 1000, // Convert maxDistance to meters, then * 1000
                    },
                },
                { $match: { approvalStatus: 'Approved' } },
                { $sort: { distance: 1 } },
                { $limit: limit },
            ]);
            return nearestTheaters;
        });
    }
    saveTheater(theater) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterData = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(theater))), { _id: undefined, otp: undefined });
            return yield new theaterModel_1.theaterModel(theaterData).save();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findById({ _id: id });
        });
    }
    // async findByLocation(location: ILocation): Promise<ITheater | null> {
    //     throw new Error("Method not implemented.");
    // }
    findAllTheaters(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, 'i');
            return yield theaterModel_1.theaterModel.find({
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
    findTheaterCount(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(searchQuery, 'i');
            return yield theaterModel_1.theaterModel.find({
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                    { mobile: { $regex: regex } }
                ]
            }).count();
        });
    }
    blockTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theater = yield theaterModel_1.theaterModel.findById({ _id: theaterId });
                if (theater !== null) {
                    theater.isBlocked = !theater.isBlocked;
                    yield theater.save();
                }
                else {
                    throw Error('Something went wrong, theaterId did\'t received');
                }
            }
            catch (error) {
                throw Error('Error while blocking/unblocking user');
            }
        });
    }
    updateTheater(theaterId, theater) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                name: theater.name,
                mobile: theater.mobile,
                address: theater.address,
                coords: theater.coords
            }, { new: true });
        });
    }
    approveTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                approvalStatus: 'Approved'
            }, { new: true });
        });
    }
    rejectTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                approvalStatus: 'Rejected'
            }, { new: true });
        });
    }
    updateTheaterProfilePic(theaterId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                $set: {
                    profilePic: fileName
                }
            }, { new: true });
        });
    }
    removeTheaterProfilePic(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                $unset: {
                    profilePic: ''
                }
            }, { new: true });
        });
    }
    updateWallet(theaterId, amount, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // const walletHistory: Omit<IWalletHistory, 'date'> = {
            //     amount,
            //     message
            // }
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount, message } }
            }, { new: true });
        });
    }
    updateScreenCount(theaterId, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, { $inc: { screenCount: count } }, { new: true });
        });
    }
    getWalletHistory(theaterId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterData = yield theaterModel_1.theaterModel.findById({ _id: theaterId });
            return theaterData !== null
                ? {
                    walletHistory: theaterData.walletHistory.slice((page - 1) * limit, page * limit),
                    count: theaterData.walletHistory.length
                }
                : null;
        });
    }
}
exports.TheaterRepository = TheaterRepository;
