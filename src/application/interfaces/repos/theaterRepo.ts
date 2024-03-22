import { ITheater } from "../../../entities/theater"
import { IWalletHistoryAndCount } from "../types/common"
import { ITempTheaterRes } from "../types/tempTheater"
import { ITheaterRes, ITheaterUpdate } from "../types/theater"


export interface ITheaterRepo {
    getNearestTheaters(lon: number, lat: number, radius: number): Promise<ITheater[]>
    getNearestTheatersByLimit(lon: number, lat: number, limit: number, maxDistance: number): Promise<ITheater[]>
    saveTheater(theater: ITempTheaterRes): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: string): Promise<ITheater | null>
    findAllTheaters(page: number, limit: number, searchQuery: string): Promise<ITheaterRes[]>
    findTheaterCount (searchQuery: string): Promise<number>
    blockTheater(theaterId: string): Promise<void>
    updateTheater(theaterId: string, theater: ITheaterUpdate): Promise<ITheaterRes | null>
    approveTheater(theaterId: string): Promise<ITheaterRes | null>
    rejectTheater(theaterId: string): Promise<ITheaterRes | null>
    updateTheaterProfilePic(theaterId: string, fileName: string): Promise<ITheaterRes | null>
    removeTheaterProfilePic(theaterId: string): Promise<ITheaterRes | null>
    updateWallet (theaterId: string, amount: number, message: string): Promise<ITheaterRes | null>
    updateScreenCount (theaterId: string, count: number): Promise<ITheaterRes | null>
    getWalletHistory (theaterId: string, page: number, limit: number): Promise<IWalletHistoryAndCount | null>
}