import { ID } from "../common"
import { ITempTheaterReq, ITempTheaterRes } from "../schema/tempTheaterSchema"

export interface ITempTheaterRepo {
    saveTheater(theater: ITempTheaterReq): Promise<ITempTheaterRes>
    // findByEmail(email: string): Promise<ITempTheaterRes | null>
    // findById(id: string): Promise<ITempTheaterRes | null>
    unsetTheaterOTP (id: ID, email: string ): Promise<ITempTheaterRes | null>
}