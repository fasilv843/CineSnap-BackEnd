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
exports.TempTicketRepository = void 0;
const tempTicketModel_1 = require("../../entities/models/temp/tempTicketModel");
class TempTicketRepository {
    saveTicketDataTemporarily(ticketData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new tempTicketModel_1.tempTicketModel(ticketData).save();
        });
    }
    getTicketData(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTicketModel_1.tempTicketModel.findById(ticketId).populate('movieId').populate('showId').populate('screenId').populate('theaterId');
        });
    }
    findTempTicketById(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTicketModel_1.tempTicketModel.findById(ticketId).select({ _id: 0, expireAt: 0 });
        });
    }
    getTicketDataWithoutPopulate(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTicketModel_1.tempTicketModel.findByIdAndDelete(ticketId).select({ _id: 0, expireAt: 0 });
        });
    }
    deleteTicketData(tempTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTicketModel_1.tempTicketModel.findByIdAndDelete(tempTicketId);
        });
    }
    getHoldedSeats(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tempTicketModel_1.tempTicketModel.find({ showId }, { _id: 0, diamondSeats: 1, goldSeats: 1, silverSeats: 1 });
        });
    }
}
exports.TempTicketRepository = TempTicketRepository;
