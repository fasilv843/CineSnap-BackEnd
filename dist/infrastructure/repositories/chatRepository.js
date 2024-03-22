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
exports.ChatRepository = void 0;
const chatModel_1 = require("../db/chatModel");
class ChatRepository {
    saveMessage(chatReqs) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(chatReqs, 'chat data from repo');
            return yield chatModel_1.chatModel.findOneAndUpdate({
                userId: chatReqs.userId,
                theaterId: chatReqs.theaterId,
                adminId: chatReqs.adminId
            }, {
                $push: {
                    messages: {
                        sender: chatReqs.sender,
                        message: chatReqs.message
                    }
                }
            }, {
                new: true,
                upsert: true
            });
        });
    }
    getChatHistory(userId, theaterId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatModel_1.chatModel.findOneAndUpdate({ userId, theaterId, adminId }, { $set: { "messages.$[].isRead": true } }, // Update isRead for all elements in the messages array
            { new: true });
        });
    }
    getTheatersChattedWith(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allChats = yield chatModel_1.chatModel.find({ userId }).populate('theaterId');
            const theaters = allChats.map(chat => chat.theaterId);
            // console.log(theaters, 'theaters from get theaters for chats');
            return theaters;
        });
    }
    getUsersChattedWith(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allChats = yield chatModel_1.chatModel.find({ theaterId }).populate('userId');
            const users = allChats.map(chat => {
                const unreadCount = chat.messages.filter(msg => msg.sender === 'User' && msg.isRead === false).length;
                const { _id, name, profilePic } = chat.userId;
                return { _id, name, profilePic, unreadCount };
            });
            // console.log(users, 'users from get users for chats');
            return users;
        });
    }
    markLastMsgAsRead(msgData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, theaterId, adminId, msgId } = msgData;
            yield chatModel_1.chatModel.findOneAndUpdate({ userId, theaterId, adminId, 'messages._id': msgId }, {
                $set: {
                    'messages.$.isRead': true,
                },
            });
        });
    }
}
exports.ChatRepository = ChatRepository;
