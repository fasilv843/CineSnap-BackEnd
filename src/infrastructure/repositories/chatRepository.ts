
import { chatModel } from "../../entities/models/chatModel";
import { ID } from "../../interfaces/common";
import { IChatReqs, IChatRes } from "../../interfaces/schema/chatSchems";
import { ITheaterRes } from "../../interfaces/schema/theaterSchema";
import { IUserRes } from "../../interfaces/schema/userSchema";


export class ChatRepository { // implements IChatRepo

    // async startNewChat (chatReqs: IChatReqs): Promise<IChatRes> {
    //     const chatData = {
    //         userId: chatReqs.userId,
    //         theaterId: chatReqs.theaterId,
    //         adminId: chatReqs.adminId,
    //         messages: [{
    //             sender: chatReqs.sender,
    //             message: chatReqs.message
    //         }]
    //     }
    //     return await new chatModel(chatData)
    // }

    // async addMessageToChat (chatId: ID, messageData: IChatMessage): Promise<IChatRes | null> {
    //     return await chatModel.findByIdAndUpdate(
    //         { _id: chatId },
    //         {
    //             $push: {
    //                 messages: messageData
    //             }
    //         },
    //         { new: true }
    //     )
    // }

    async saveMessage (chatReqs: IChatReqs): Promise<IChatRes | null> {
        // console.log(chatReqs, 'chat data from repo');
        
        return await chatModel.findOneAndUpdate(
            { 
                userId: chatReqs.userId,
                theaterId: chatReqs.theaterId,
                adminId: chatReqs.adminId
            },
            {
                $push: {
                    messages: {
                        sender: chatReqs.sender,
                        message: chatReqs.message
                    }
                }
            },
            { 
                new: true,
                upsert: true
            }
        )
    }

    async getChatHistory (userId: ID | undefined, theaterId: ID | undefined, adminId: ID | undefined): Promise<IChatRes | null>{
        return await chatModel.findOne({ userId, theaterId, adminId })
    }

    async getTheatersChattedWith (userId: ID): Promise<ITheaterRes[]> {
        const allChats = await chatModel.find({ userId }).populate('theaterId')
        const theaters = allChats.map(chat => chat.theaterId)
        // console.log(theaters, 'theaters from get theaters for chats');
        return theaters as unknown as ITheaterRes[]
    }

    async getUsersChattedWith (theaterId: ID): Promise<IUserRes[]> {
        const allChats = await chatModel.find({ theaterId }).populate('userId')
        const users = allChats.map(chat => chat.userId)
        // console.log(users, 'users from get users for chats');
        return users as unknown as IUserRes[]
    }
}