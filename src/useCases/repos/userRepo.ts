import { IUser } from "../../entities/user"
import {IUserRes } from "../../interfaces/schema/userSchema" 

export interface IUserRepo {
    saveUser(user: IUser):Promise<IUser>
    findByEmail(email: string):Promise<IUser | null>
    findById(id: string):Promise<IUser | null>
    findAllUsers(page: number, limit: number, searchQuery: string): Promise< IUserRes[]>
}
