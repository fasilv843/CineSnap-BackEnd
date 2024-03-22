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
exports.TicketRepository = void 0;
const console_1 = require("console");
const ticketModel_1 = require("../db/ticketModel");
class TicketRepository {
    saveTicket(tempTicket) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new ticketModel_1.ticketModel(tempTicket).save();
        });
    }
    findTicketById(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.findById(ticketId);
        });
    }
    getTicketData(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.findById(ticketId).populate('movieId')
                .populate('showId').populate('screenId').populate('theaterId');
        });
    }
    getTicketsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.find({ userId }).sort({ createdAt: -1 }).populate('movieId')
                .populate('showId').populate('screenId').populate('theaterId');
        });
    }
    getTicketsByTheaterId(theaterId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.find({ theaterId }).skip((page - 1) * limit)
                .limit(limit).sort({ createdAt: -1 }).populate('movieId')
                .populate('showId').populate('screenId').populate('theaterId').populate('userId');
        });
    }
    getTicketsOfTheaterByTime(theaterId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, console_1.log)(startDate, endDate, 'start and end from getTickets of Theater by time');
            return yield ticketModel_1.ticketModel.find({
                theaterId,
                isCancelled: false,
                $and: [
                    { startTime: { $gte: startDate } }, // Date is greater than or equal to startDate
                    { startTime: { $lte: endDate } } // Date is less than or equal to endDate
                ]
            });
        });
    }
    findTicketsByTime(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, console_1.log)(startDate, endDate, 'start and end from getTickets of Theater by time');
            return yield ticketModel_1.ticketModel.find({
                isCancelled: false,
                $and: [
                    { startTime: { $gte: startDate } }, // Date is greater than or equal to startDate
                    { startTime: { $lte: endDate } } // Date is less than or equal to endDate
                ]
            });
        });
    }
    getTicketsByTheaterIdCount(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.countDocuments({ theaterId }).exec();
        });
    }
    getTicketsByShowId(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.find({ showId }).sort({ createdAt: -1 }).populate('movieId')
                .populate('showId').populate('screenId').populate('theaterId');
        });
    }
    getAllTickets(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.find({}).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
                .populate('userId').populate('movieId').populate('theaterId');
        });
    }
    getAllTicketsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.countDocuments({}).exec();
        });
    }
    cancelTicket(ticketId, cancelledBy) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketModel_1.ticketModel.findByIdAndUpdate({ _id: ticketId }, {
                $set: {
                    isCancelled: true,
                    cancelledBy
                }
            });
        });
    }
}
exports.TicketRepository = TicketRepository;
