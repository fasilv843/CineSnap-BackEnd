// import { Schema } from "mongoose";
import { IShowRes, IShowsOnAScreen } from "./schema/showSchema";
import { IChatRes, IUsersListForChats } from "./schema/chatSchems";
import { ITheaterRes, ITheatersAndCount } from "./schema/theaterSchema";
import { IUserRes, IUsersAndCount } from "./schema/userSchema";
import { ITempTicketRes, ITicketRes, ITicketsAndCount, Seats } from "./schema/ticketSchema";
import { ITempTheaterRes } from "./schema/tempTheaterSchema";
import { IAvailCatsOnScreen } from "./schema/screenSeatSchema";
import { IShowSeatsRes } from "./schema/showSeatsSchema";
import { ICouponRes } from "./schema/couponSchema";
import { IRevenueData } from "./chart";
import { IWalletHistory } from "../entities/common";
import { IMovie } from "../entities/movie";
import { IScreen } from "../entities/screen";
import { IShow } from "../entities/show";
import { IScreenSeat } from "../entities/screenSeat";

export type Location = [number, number];


export interface IWalletHistoryAndCount {
    walletHistory: IWalletHistory[],
    count: number
}

export type AllResTypes = ITheaterRes | ITheaterRes[] | ITempTheaterRes | IMovie | IMovie[] | IAvailCatsOnScreen | ICouponRes[]
            | IUserRes | IUserRes[] | IShowRes | IShowsOnAScreen[] | IScreen | IScreen[] | IScreenSeat | IWalletHistoryAndCount
            | IShow | IChatRes | ITicketRes | ITicketRes[] | ITicketsAndCount | IUsersListForChats[] | IShowSeatsRes | ICouponRes
            | ITempTicketRes | ITempTicketRes[] | Seats | IUsersAndCount | ITheatersAndCount | null | IRevenueData

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

