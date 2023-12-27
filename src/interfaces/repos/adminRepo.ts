import { IAdmin } from "../schema/adminSchema"

export interface IAdminRepo {
    findAdmin(): Promise<IAdmin | null>
}
