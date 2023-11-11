import { User } from "../schemaInterface";

export interface UserRepo {
    saveUser(user: User):Promise<User>
    findByEmail(email: string):Promise<User | null>
    findById(id: string):Promise<User | null>
    findAllUsers():Promise< User[] | [] >
}
