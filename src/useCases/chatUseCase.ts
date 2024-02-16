import { log } from "console";
import { STATUS_CODES } from "../infrastructure/constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ChatRepository } from "../infrastructure/repositories/chatRepository";
import { IApiRes } from "../interfaces/common";
import { IApiChatRes, IChatReadReqs, IChatReqs, IChatRes, IUsersListForChats } from "../interfaces/schema/chatSchems";
import { IApiTheatersRes } from "../interfaces/schema/theaterSchema";

export class ChatUseCase {
    constructor (
        private readonly chatRepository: ChatRepository
    ) {}

    async sendMessage (chatData: IChatReqs): Promise<IApiChatRes> {
        try {
            if (((chatData.userId && chatData.theaterId) || (chatData.userId && chatData.adminId) || (chatData.theaterId && chatData.adminId)) && !(chatData.userId && chatData.theaterId && chatData.adminId)) {
                const savedMessage = await this.chatRepository.saveMessage(chatData)
                return get200Response(savedMessage as IChatRes)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            console.log(error, 'error while saving chat message');
            throw Error('error while saving message')
        }
    }

    async getChatHistory(userId: string | undefined, theaterId: string | undefined, adminId: string | undefined): Promise<IApiChatRes> {
        try {
            console.log(userId, theaterId, adminId, 'ids from getHistory use case');
            
            if (((userId && theaterId) || (userId && adminId) || (theaterId && adminId)) && !(userId && theaterId && adminId)) {
                const chats = await this.chatRepository.getChatHistory(userId, theaterId, adminId)
                return get200Response(chats as IChatRes) // handle it from front end
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTheatersChattedWith (userId: string): Promise<IApiTheatersRes> {
        try {
            const users = await this.chatRepository.getTheatersChattedWith(userId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUsersChattedWith (theaterId: string): Promise<IApiRes<IUsersListForChats[] | null>> {
        try {
            const users = await this.chatRepository.getUsersChattedWith(theaterId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async markLastMsgAsRead (msgData: IChatReadReqs): Promise<IApiRes<null>> {
        try {
            if (msgData.userId === '') msgData.userId = undefined
            if (msgData.theaterId === '') msgData.theaterId = undefined
            if (msgData.adminId === '') msgData.adminId = undefined
            log(msgData, 'msgData before checking')
            if (((msgData.userId && msgData.theaterId) || (msgData.userId && msgData.adminId) || (msgData.theaterId && msgData.adminId)) && 
                !(msgData.userId && msgData.theaterId && msgData.adminId)
            ) {
                await this.chatRepository.markLastMsgAsRead(msgData)
                return get200Response(null)
            } else {
                log(msgData, 'msgData that has error')
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}