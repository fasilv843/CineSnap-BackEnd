import userModel from "../../entities/models/userModel";
import { IUserRepo } from "../../interfaces/repos/userRepo";
import { IUser, IUserAuth, IUserSocialAuth } from "../../interfaces/schema/userSchema"; 


export class UserRepository implements IUserRepo {

    async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
        console.log('on user repository saving user'); 
        return await new userModel(user).save()
    }

    async findById(id: string): Promise< IUser | null > {
        return await userModel.findById({_id: id})
    }

    async findByEmail(email: string): Promise< IUser | null > {
        return await userModel.findOne({ email })
    }

    async findAllUsers(): Promise< IUser[] | [] > {
        try {
            return await userModel.find({}).select('-password').exec()
        } catch (error) {
            throw Error("Error while finding users")
        }
    }

    async updateGoogleAuth(id: string, profilePic: string | undefined){
        try {
            const userData =  await userModel.findById({ _id: id })
            if(userData){
                userData.isGoogleAuth = true
                if(!userData.profilePic) userData.profilePic = profilePic
                await userData.save()
            }
        } catch (error) {
            console.log(error);
            throw Error('Error while updating google auth')
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