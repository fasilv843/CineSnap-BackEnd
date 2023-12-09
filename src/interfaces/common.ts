import { Schema } from "mongoose";
import { IShowRes, IShowsOnAScreen, IShow } from "./schema/showSchema";

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

export type AllResTypes = IShowRes | IShowsOnAScreen[] | IShow | null;
export type SuccessTypes = Exclude<AllResTypes, null>

export interface IApiRes<T extends AllResTypes> {
    status: number;
    message: string;
    data: T;
}