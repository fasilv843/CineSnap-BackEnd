import { IShowRes, IShowsOnAScreen } from "./show";
import { IChatRes, IUsersListForChats } from "./chat";
import { ITheaterRes, ITheatersAndCount } from "./theater";
import { IUserRes, IUsersAndCount } from "./user";
import { ITempTicketRes, ITicketRes, ITicketsAndCount, Seats } from "./ticket";
import { ITempTheaterRes } from "./tempTheater";
import { IAvailCatsOnScreen } from "./screenSeat";
import { IShowSeatsRes } from "./showSeats";
import { ICouponRes } from "./coupon";
import { IRevenueData } from "./graphs";
import { IWalletHistory } from "../../../entities/common";
import { IMovie } from "../../../entities/movie";
import { IScreen } from "../../../entities/screen";
import { IShow } from "../../../entities/show";
import { IScreenSeat } from "../../../entities/screenSeat";

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

