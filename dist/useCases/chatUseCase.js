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
exports.ChatUseCase = void 0;
const console_1 = require("console");
const httpStausCodes_1 = require("../constants/httpStausCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
class ChatUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    sendMessage(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (((chatData.userId && chatData.theaterId) || (chatData.userId && chatData.adminId) || (chatData.theaterId && chatData.adminId)) && !(chatData.userId && chatData.theaterId && chatData.adminId)) {
                    const savedMessage = yield this.chatRepository.saveMessage(chatData);
                    return (0, response_1.get200Response)(savedMessage);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST);
                }
            }
            catch (error) {
                console.log(error, 'error while saving chat message');
                throw Error('error while saving message');
            }
        });
    }
    getChatHistory(userId, theaterId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, theaterId, adminId, 'ids from getHistory use case');
                if (((userId && theaterId) || (userId && adminId) || (theaterId && adminId)) && !(userId && theaterId && adminId)) {
                    const chats = yield this.chatRepository.getChatHistory(userId, theaterId, adminId);
                    return (0, response_1.get200Response)(chats); // handle it from front end
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST);
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTheatersChattedWith(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.chatRepository.getTheatersChattedWith(userId);
                return (0, response_1.get200Response)(users);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getUsersChattedWith(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.chatRepository.getUsersChattedWith(theaterId);
                return (0, response_1.get200Response)(users);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    markLastMsgAsRead(msgData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (msgData.userId === '')
                    msgData.userId = null;
                if (msgData.theaterId === '')
                    msgData.theaterId = null;
                if (msgData.adminId === '')
                    msgData.adminId = null;
                (0, console_1.log)(msgData, 'msgData before checking');
                if (((msgData.userId && msgData.theaterId) || (msgData.userId && msgData.adminId) || (msgData.theaterId && msgData.adminId)) &&
                    !(msgData.userId && msgData.theaterId && msgData.adminId)) {
                    yield this.chatRepository.markLastMsgAsRead(msgData);
                    return (0, response_1.get200Response)(null);
                }
                else {
                    (0, console_1.log)(msgData, 'msgData that has error');
                    return (0, response_1.getErrorResponse)(httpStausCodes_1.STATUS_CODES.BAD_REQUEST);
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ChatUseCase = ChatUseCase;
