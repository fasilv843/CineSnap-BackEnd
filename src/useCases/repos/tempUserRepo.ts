import { ITempUserReq, ITempUserRes } from "../../interfaces/schema/tempUserSchema"

export interface ITempUserRepo {
    saveUser(user: ITempUserReq): Promise<ITempUserRes>
    findByEmail(email: string): Promise<ITempUserRes | null>
    findById(id: string): Promise<ITempUserRes | null>
    unsetOtp(id: string, email: string): Promise<ITempUserRes | null>
    updateOTP(id: string, email: string, OTP: number): Promise<ITempUserRes | null>
}