import userModel from "../../entities/models/userModel";
import { ID } from "../../interfaces/common";
import { IUserRepo } from "../../interfaces/repos/userRepo";
import { IUser, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../../interfaces/schema/userSchema"; 


export class UserRepository implements IUserRepo {

    async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
        console.log('on user repository saving user'); 
        return await new userModel(user).save()
    }

    async findById(id: ID): Promise< IUser | null > {
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

    async updateGoogleAuth(id: ID, profilePic: string | undefined){
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

    async getUserData (userId: ID): Promise<IUserRes | null> {
        return await userModel.findById(userId)
    }

    async updateUser (userId: ID, user: IUserUpdate): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                name: user.name,
                mobile: user.mobile,
                dob: user.dob,
                address: user.address,
                coords: user.coords
            },
            { new: true }
        )
    }
    
}