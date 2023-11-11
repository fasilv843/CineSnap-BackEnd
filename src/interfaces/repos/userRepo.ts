import { IUser } from "../schema/userSchema" 

export interface IUserRepo {
    saveUser(user: IUser):Promise<IUser>
    findByEmail(email: string):Promise<IUser | null>
    findById(id: string):Promise<IUser | null>
    findAllUsers():Promise< IUser[] | [] >
}
