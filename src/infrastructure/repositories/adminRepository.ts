import { IAdmin } from "../../entities/admin";
import { IAdminRepo } from "../../application/interfaces/repos/adminRepo";
import { adminModel } from "../db/adminModel";

export class AdminRepository implements IAdminRepo {
    async findAdmin(): Promise<IAdmin | null> {
        return await adminModel.findOne()
    }

    async findById(adminId: string): Promise<IAdmin | null> {
        return await adminModel.findById(adminId)
    }

    async updateWallet (amount: number, message: string): Promise<IAdmin | null> {
        return await adminModel.findOneAndUpdate(
            {},
            {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount , message} }
            },
            { new: true }
        )
    }

}