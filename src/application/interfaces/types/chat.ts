import { IApiRes } from "./common";


export interface IChatMessage {
    sender: 'User' | 'Theater' | 'Admin'; // User, Theater, or Admin _id
    message: string;
    time: Date;
    isRead: boolean
}

export interface IChatHistory {
    userId?: string; // User _id
    theaterId?: string; // Theater _id
    adminId?: string; // Admin _id
    messages: Array<IChatMessage>;
}

export interface IChatReqs extends Omit<IChatHistory, 'messages'>, Omit<IChatMessage, 'time' | 'isRead'> {}
export interface IChatRes extends IChatHistory { }
export interface IApiChatRes extends IApiRes<IChatRes | null> { }

export interface IUsersListForChats {
    _id: string
    name: string
    profilePic?: string
    unreadCount: number
}

export interface IChatReadReqs { 
    userId: string | undefined,
    theaterId: string | undefined,
    adminId: string | undefined,
    msgId: string
}