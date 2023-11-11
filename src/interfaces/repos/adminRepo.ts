import { IAdmin } from "../schema/adminSchema"

export interface IAdminRepo {
    findByEmail(email: string):Promise<IAdmin | null>
    findById(id: string):Promise<IAdmin | null>
}
