
import { chatModel } from "../db/chatModel";
import { IChatReadReqs, IChatReqs, IChatRes, IUsersListForChats } from "../../interfaces/schema/chatSchems";
import { ITheaterRes } from "../../interfaces/schema/theaterSchema";
import { IUserRes } from "../../interfaces/schema/userSchema";
import { IChatRepo } from "../../useCases/repos/chatRepo";


export class ChatRepository implements IChatRepo {

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

    async getChatHistory (userId: string | undefined, theaterId: string | undefined, adminId: string | undefined): Promise<IChatRes | null>{
        return await chatModel.findOneAndUpdate(
            { userId, theaterId, adminId },
            { $set: { "messages.$[].isRead": true } },  // Update isRead for all elements in the messages array
            { new: true }
        )
    }

    async getTheatersChattedWith (userId: string): Promise<ITheaterRes[]> {
        const allChats = await chatModel.find({ userId }).populate('theaterId')
        const theaters = allChats.map(chat => chat.theaterId)
        // console.log(theaters, 'theaters from get theaters for chats');
        return theaters as unknown as ITheaterRes[]
    }

    async getUsersChattedWith (theaterId: string): Promise<IUsersListForChats[]> {
        const allChats = await chatModel.find({ theaterId }).populate('userId')
        const users: IUsersListForChats[] = allChats.map(chat => {
            const unreadCount = chat.messages.filter(msg => msg.sender === 'User' && msg.isRead === false).length
            const { _id, name, profilePic } = chat.userId as unknown as IUserRes
            return { _id, name, profilePic, unreadCount }
        })
        // console.log(users, 'users from get users for chats');
        return users
    }

    async markLastMsgAsRead (msgData: IChatReadReqs): Promise<undefined> {
        const { userId, theaterId, adminId, msgId } = msgData
        await chatModel.findOneAndUpdate(
            { userId, theaterId, adminId, 'messages._id': msgId },
            {
              $set: {
                'messages.$.isRead': true,
              },
            }
        );
    }
}