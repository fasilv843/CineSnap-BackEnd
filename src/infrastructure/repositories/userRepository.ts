import { log } from "console";
import userModel from "../db/userModel";
import { IWalletHistoryAndCount } from "../../interfaces/common";
import { IUserRepo } from "../../useCases/repos/userRepo";
import { IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../../interfaces/schema/userSchema"; 
import { IUser } from "../../entities/user";


export class UserRepository implements IUserRepo {

    async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
        console.log('on user repository saving user'); 
        return await new userModel(user).save()
    }

    async findById(id: string): Promise< IUser | null > {
        return await userModel.findById({_id: id})
    }

    async findUserCoupons (userId: string): Promise<IUserRes | null> {
        return await userModel.findById({ _id: userId }, { _id: 0, usedCoupons: 1 })
    }

    async findByEmail(email: string): Promise< IUser | null > {
        return await userModel.findOne({ email })
    }

    async findAllUsers(page: number, limit: number, searchQuery: string): Promise< IUserRes[]> {
        const regex = new RegExp(searchQuery, 'i')
        return await userModel.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
                { mobile: { $regex: regex } }
            ]
        })
        .skip((page -1) * limit)
        .limit(limit)
        .select('-password')
        .exec()
    }

    async findUserCount (searchQuery: string = ''): Promise<number> {
        const regex = new RegExp(searchQuery, 'i')
        return await userModel.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
                { mobile: { $regex: regex } }
            ]
        }).count() 
    }

    async updateGoogleAuth(id: string, profilePic: string | undefined){
        try {
            const userData =  await userModel.findById({ _id: id })
            if(userData){
                userData.isGoogleAuth = true
                if(!userData.profilePic) userData.profilePic = profilePic
                await userData.save()
            }
        } catch (error) {
            console.log(error);
            throw Error('Error while updating google auth')
        }
    }

    async blockUnblockUser(userId: string) {
        try {
            const user = await userModel.findById({_id: userId})
            if(user !== null) {
                user.isBlocked = !user.isBlocked
                await user.save()
            }else{
                throw Error('Something went wrong, userId didt received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    }

    async getUserData (userId: string): Promise<IUserRes | null> {
        return await userModel.findById(userId)
    }

    async updateUser (userId: string, user: IUserUpdate): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                name: user.name,
                mobile: user.mobile,
                dob: user.dob,
                address: user.address,
                coords: user.coords
            },
            { new: true }
        )
    }

    async updateUserProfilePic(userId: string, fileName: string): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $set: {
                    profilePic: fileName
                }
            },
            { new: true }
        )
    }

    async removeUserProfileDp(userId: string): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $unset: {
                    profilePic: ''
                }
            },
            { new: true }
        )
    }
    
    async updateWallet (userId: string, amount: number, message: string): Promise<IUserRes | null> {
        log(userId, 'userID from update wallet of user')
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount , message} }
            },
            { new: true }
        )
    }

    async getWalletHistory (userId: string, page: number = 1, limit: number = 10): Promise<IWalletHistoryAndCount | null> {
        const userData = await userModel.findById({ _id: userId })

        return userData !== null 
            ? { 
                walletHistory: userData.walletHistory.slice((page - 1) * limit, page * limit), 
                count: userData.walletHistory.length 
            } 
            : null
    }

    async addToUsedCoupons (userId: string, couponId: string, ticketId: string): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    usedCoupons: { couponId, ticketId }
                }
            }, 
            { new: true }
        )
    }
}