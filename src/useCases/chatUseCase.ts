import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ChatRepository } from "../infrastructure/repositories/chatRepository";
import { ID } from "../interfaces/common";
import { IApiChatRes, IChatReqs, IChatRes } from "../interfaces/schema/chatSchems";
import { IApiTheatersRes } from "../interfaces/schema/theaterSchema";
import { IApiUsersRes } from "../interfaces/schema/userSchema";


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

    async getChatHistory(userId: ID | undefined, theaterId: ID | undefined, adminId: ID | undefined): Promise<IApiChatRes> {
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

    async getTheatersChattedWith (userId: ID): Promise<IApiTheatersRes> {
        try {
            const users = await this.chatRepository.getTheatersChattedWith(userId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUsersChattedWith (theaterId: ID): Promise<IApiUsersRes> {
        try {
            const users = await this.chatRepository.getUsersChattedWith(theaterId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}