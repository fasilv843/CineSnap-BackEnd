import { ID } from "../common"
import { IUser, IUserRes } from "../schema/userSchema" 

export interface IUserRepo {
    saveUser(user: IUser):Promise<IUser>
    findByEmail(email: string):Promise<IUser | null>
    findById(id: ID):Promise<IUser | null>
    findAllUsers(page: number, limit: number, searchQuery: string): Promise< IUserRes[]>
}
