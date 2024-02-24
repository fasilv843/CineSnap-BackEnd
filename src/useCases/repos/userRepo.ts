import { IUser } from "../../entities/user"
import { IWalletHistoryAndCount } from "../../interfaces/common"
import {IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../../interfaces/schema/userSchema" 

export interface IUserRepo {
    saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser>
    findById(id: string): Promise<IUser | null>
    findUserCoupons (userId: string): Promise<IUserRes | null>
    findByEmail(email: string): Promise<IUser | null>
    findAllUsers(page: number, limit: number, searchQuery: string): Promise<IUserRes[]>
    findUserCount (searchQuery: string): Promise<number>
    updateGoogleAuth(id: string, profilePic: string | undefined): Promise<void>
    blockUnblockUser(userId: string): Promise<void>
    getUserData (userId: string): Promise<IUserRes | null>
    updateUser (userId: string, user: IUserUpdate): Promise<IUserRes | null>
    updateUserProfilePic(userId: string, fileName: string): Promise<IUserRes | null>
    removeUserProfileDp(userId: string): Promise<IUserRes | null>
    updateWallet (userId: string, amount: number, message: string): Promise<IUserRes | null>
    getWalletHistory (userId: string, page: number, limit: number): Promise<IWalletHistoryAndCount | null>
    addToUsedCoupons (userId: string, couponId: string, ticketId: string): Promise<IUserRes | null>
}
