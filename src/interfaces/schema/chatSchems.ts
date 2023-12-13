import { IApiRes, ID } from "../common";


export interface IChatMessage {
    sender: 'User' | 'Theater' | 'Admin'; // User, Theater, or Admin _id
    message: string;
    time: Date;
}

export interface IChatHistory {
    userId?: ID; // User _id
    theaterId?: ID; // Theater _id
    adminId?: ID; // Admin _id
    messages: Array<IChatMessage>;
}

export interface IChatReqs extends Omit<IChatHistory, 'messages'>, Omit<IChatMessage, 'time'> {}
export interface IChatRes extends IChatHistory { }
export interface IApiChatRes extends IApiRes<IChatRes | null> { }