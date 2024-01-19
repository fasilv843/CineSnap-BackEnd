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
exports.ChatController = void 0;
class ChatController {
    constructor(chatUseCase) {
        this.chatUseCase = chatUseCase;
    }
    getChatHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, theaterId, adminId } = req.query;
            const apiRes = yield this.chatUseCase.getChatHistory(userId, theaterId, adminId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTheatersChattedWith(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.chatUseCase.getTheatersChattedWith(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getUsersChattedWith(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.chatUseCase.getUsersChattedWith(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    markLastMsgAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, theaterId, adminId, msgId } = req.query;
            const msgData = { userId, theaterId, adminId, msgId };
            const apiRes = yield this.chatUseCase.markLastMsgAsRead(msgData);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.ChatController = ChatController;
