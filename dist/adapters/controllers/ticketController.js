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
exports.TicketController = void 0;
class TicketController {
    constructor(_ticketUseCase) {
        this._ticketUseCase = _ticketUseCase;
    }
    bookTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketReqs = req.body.ticketReqs;
            const apiRes = yield this._ticketUseCase.bookTicketDataTemporarily(ticketReqs);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getHoldedSeats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showId = req.params.showId;
            const apiRes = yield this._ticketUseCase.getHoldedSeats(showId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTicketData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.ticketId;
            const apiRes = yield this._ticketUseCase.getTicketData(ticketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTempTicketData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.ticketId;
            const apiRes = yield this._ticketUseCase.getTempTicketData(ticketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    confirmTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempTicketId = req.body.ticketId;
            const couponId = req.body.couponId;
            const paymentMethod = req.body.paymentMethod;
            const useWallet = Boolean(req.body.useWallet);
            const apiRes = yield this._ticketUseCase.confirmTicket(tempTicketId, paymentMethod, useWallet, couponId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTicketsOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this._ticketUseCase.getTicketsOfUser(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTicketsOfShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showId = req.params.showId;
            const apiRes = yield this._ticketUseCase.getTicketsOfShow(showId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    cancelTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.ticketId;
            const cancelledBy = req.body.cancelledBy;
            const apiRes = yield this._ticketUseCase.cancelTicket(ticketId, cancelledBy);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTicketsOfTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const apiRes = yield this._ticketUseCase.getTicketsOfTheater(theaterId, page, limit);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAllTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const apiRes = yield this._ticketUseCase.getAllTickets(page, limit);
            res.status(apiRes.status).json(apiRes);
        });
    }
    sendInvoiceMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.body.ticketId;
            const apiRes = yield this._ticketUseCase.sendInvoiceMail(ticketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.TicketController = TicketController;
