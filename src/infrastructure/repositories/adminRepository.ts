import { IAdminRepo } from "../../interfaces/repos/adminRepo";
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { adminModel } from "../../entities/models/adminModel";

export class AdminRepository implements IAdminRepo {
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await adminModel.findOne({email})
    }
    
    async findById(id: string): Promise<IAdmin | null> {
        return await adminModel.findById({_id: id})
    }

}