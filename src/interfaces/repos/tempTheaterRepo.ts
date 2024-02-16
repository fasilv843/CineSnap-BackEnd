import { ITempTheaterReq, ITempTheaterRes } from "../schema/tempTheaterSchema"

export interface ITempTheaterRepo {
    saveTheater(theater: ITempTheaterReq): Promise<ITempTheaterRes>
    // findByEmail(email: string): Promise<ITempTheaterRes | null>
    // findById(id: string): Promise<ITempTheaterRes | null>
    unsetTheaterOTP (id: string, email: string ): Promise<ITempTheaterRes | null>
}