import { IAdmin } from "../../interfaces/schema/adminSchema"

export interface IAdminRepo {
    findAdmin(): Promise<IAdmin | null>
}
