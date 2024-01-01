import { tempUserModel } from "../../entities/models/temp/tempUserModel";
import { ID } from "../../interfaces/common";
import { ITempUserRepo } from "../../interfaces/repos/tempUserRepo";
import { ITempUserReq, ITempUserRes } from "../../interfaces/schema/tempUserSchema";


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
    async findById(id: ID): Promise<ITempUserRes | null> {
        return await tempUserModel.findById({ _id: id })
    }
    async unsetOtp(id: ID, email: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findByIdAndUpdate(
            { _id: id, email },
            { $unset: { otp: 1 } },
            { new: true } // This option returns the modified document
        );
    }

    async updateOTP(id: ID, email: string, OTP: number): Promise<ITempUserRes | null> {
        return tempUserModel.findOneAndUpdate(
            { _id: id, email },
            {
                $set: { otp: OTP }
            },
            { new: true }
        )
    }
}