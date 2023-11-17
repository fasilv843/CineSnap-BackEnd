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
        try {
            return await userModel.find({})
        } catch (error) {
            throw Error("Error while finding users")
        }
    }

    async blockUnblockUser(userId: string) {
        try {
            const user = await userModel.findById({_id: userId})
            if(user !== null) {
                user.isBlocked = !user.isBlocked
                await user.save()
            }else{
                throw Error('Something went wrong, userId didt received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    } 
    
}