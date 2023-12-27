import { IAdminRepo } from "../../interfaces/repos/adminRepo";
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { adminModel } from "../../entities/models/adminModel";
import { ID } from "../../interfaces/common";

export class AdminRepository implements IAdminRepo {
    async findAdmin(): Promise<IAdmin | null> {
        return await adminModel.findOne()
    }

    async findById(adminId: ID): Promise<IAdmin | null> {
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