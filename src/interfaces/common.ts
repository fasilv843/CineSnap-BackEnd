import { Schema } from "mongoose";
import { IShowRes, IShowsOnAScreen, IShow } from "./schema/showSchema";
import { IChatRes } from "./schema/chatSchems";
import { ITheaterRes } from "./schema/theaterSchema";
import { IUserRes } from "./schema/userSchema";
import { ITempTicketRes, ITicketRes, Seats } from "./schema/ticketSchema";
import { ITempTheaterRes } from "./schema/tempTheaterSchema";

export type Location = [number, number];

export type ID = Schema.Types.ObjectId

export interface IUserAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
}

export interface ITheaterAddress extends IUserAddress {
    landmark?: string
}

export interface IWalletHistory {
    amount: number
    message: string
    date: Date
}

export interface ICoords {
    type: 'Point'
    coordinates: [number, number];
}

export type AllResTypes = ITheaterRes | ITheaterRes[] | ITempTheaterRes
            | IUserRes | IUserRes[] | IShowRes | IShowsOnAScreen[] 
            | IShow | IChatRes | ITicketRes | ITicketRes[] 
            | ITempTicketRes | ITempTicketRes[] | Seats | null;

// export type SuccessTypes = Exclude<AllResTypes>

export interface IApiRes<T extends AllResTypes> {
    status: number;
    message: string;
    data: T;
}

export interface IApiTempAuthRes<T extends AllResTypes> {
    status: number;
    message: string;
    data: T | null;
    token?: string
}

export interface IApiAuthRes extends Omit<IApiTempAuthRes<AllResTypes>, 'token'> {
    accessToken?: string,
    refreshToken?: string
}