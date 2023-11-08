import userModel from "../../entities/models/userModel";
import { UserRepo } from "../../interfaces/repos/userRepo";
import { User } from "../../interfaces/schemaInterface";


export class UserRepository implements UserRepo {

    async saveUser(user: User): Promise<User> {
        return new userModel(user).save()
    }

    async findById(id: string): Promise<User | null> {
        return await userModel.findById({_id: id})
    }

    async findByEmail(email: string): Promise<User | null> {
        return await userModel.findOne({ email })
    }

    async findAllUsers(): Promise<User[] | []> {
        return await userModel.find({})
    }
    
}