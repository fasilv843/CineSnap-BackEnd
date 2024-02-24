import { tempUserModel } from "../db/temp/tempUserModel";
import { ITempUserRepo } from "../../application/interfaces/repos/tempUserRepo";
import { ITempUserReq, ITempUserRes } from "../../application/interfaces/types/tempUser";


export class TempUserRepository implements ITempUserRepo {
    async saveUser(user: ITempUserReq): Promise<ITempUserRes> {
        return await tempUserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    name: user.name,
                    email: user.email,
                    otp: user.otp,
                    password: user.password,
                    expireAt: Date.now()
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
    }
    async findByEmail(email: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findOne({ email })
    }
    async findById(id: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findById({ _id: id })
    }
    async unsetOtp(id: string, email: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findByIdAndUpdate(
            { _id: id, email },
            { $unset: { otp: 1 } },
            { new: true } // This option returns the modified document
        );
    }

    async updateOTP(id: string, email: string, OTP: number): Promise<ITempUserRes | null> {
        return tempUserModel.findOneAndUpdate(
            { _id: id, email },
            {
                $set: { otp: OTP }
            },
            { new: true }
        )
    }
}