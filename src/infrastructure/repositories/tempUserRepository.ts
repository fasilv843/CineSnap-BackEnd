import { tempUserModel } from "../../entities/models/tempUserModel";
import { ITempUserRepo } from "../../interfaces/repos/tempUserRepo";
import { ITempUserReq, ITempUserRes } from "../../interfaces/schema/tempUserSchema";


export class TempUserRepository implements ITempUserRepo {
    async saveUser(user: ITempUserReq): Promise<ITempUserRes> {
        try {
            return await tempUserModel.findOneAndUpdate(
                {email: user.email}, 
                {
                    $set: {
                        name: user.name,
                        email: user.email,
                        otp: user.otp,
                        password: user.password,
                        expireAt: Date.now()
                    }
                }, 
                {upsert: true, new: true, setDefaultsOnInsert: true}
            )  
        } catch (error) {
            console.log('error during saving user data on tempUsers');
            throw Error('error during saving user data on tempUsers')
        }
    }
    async findByEmail(email: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findOne({ email })
    }  
    async findById(id: string): Promise<ITempUserRes | null> {
        return await tempUserModel.findById({_id: id})
    } 
    async unsetOtp(id: string, email: string): Promise<ITempUserRes | null> {
        try {
            console.log(id, email, 'values from repo');
            
            return await tempUserModel.findByIdAndUpdate(
                { _id: id, email },
                { $unset: { otp: 1 } },
                { new: true } // This option returns the modified document
            );
        } catch (error) {
            console.log(error, 'error while unsetting otp');
            throw Error('error while unsetting otp')
        }
    }
}