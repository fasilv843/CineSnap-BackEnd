import userModel from "../../entities/models/userModel";
import { IUserRepo } from "../../interfaces/repos/userRepo";
import { IUser } from "../../interfaces/schema/userSchema"; 


export class UserRepository implements IUserRepo {

    async saveUser(user: IUser): Promise<IUser> {
        return new userModel(user).save()
    }

    async findById(id: string): Promise< IUser | null > {
        return await userModel.findById({_id: id})
    }

    async findByEmail(email: string): Promise< IUser | null > {
        return await userModel.findOne({ email })
    }

    async findAllUsers(): Promise< IUser[] | [] > {
        return await userModel.find({})
    }
    
}