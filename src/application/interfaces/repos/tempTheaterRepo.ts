import { ITempTheaterReq, ITempTheaterRes } from "../types/tempTheater"

export interface ITempTheaterRepo {
    saveTheater(theater: ITempTheaterReq): Promise<ITempTheaterRes>
    unsetTheaterOTP(id: string, email: string): Promise<ITempTheaterRes | null>
    findTempTheaterById(id: string): Promise<ITempTheaterRes | null>
    updateTheaterOTP(id: string, email: string, OTP: number): Promise<ITempTheaterRes | null>
}