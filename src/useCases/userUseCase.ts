import { AuthRes } from "../Types/AuthRes";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { IUser } from "../interfaces/schema/userSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";



export class UserUseCase {
    constructor(
        private userRepository: UserRepository,
        private encrypt: Encrypt,
        private JWTToken: JWTToken
    ) { }

    async isEmailExist(email: string): Promise<IUser | null> {
        const isUserExist = await this.userRepository.findByEmail(email)
        return isUserExist
    }

    async saveUserDetails(userData: IUser) {
        const user = await this.userRepository.saveUser(userData)
        console.log('user data saved, on usecase');
        return user;
    }

    async handleSocialSignUp(name: string, email: string, profilePic: string){
        const emailData = await this.isEmailExist(email)
        if(emailData === null){
            const userToSave = { name, email, profilePic, isGoogleAuth: true }
            const savedUser = await this.saveUserDetails(userToSave)
            console.log('user details saved');
            const token = this.JWTToken.generateToken(savedUser._id as string)
            return {
                status: 200,
                message: 'Success',
                data: savedUser,
                token
            }
        } else {
            if(emailData.isBlocked){
                return {
                    status: 400,
                    message: 'You are blocked by admin',
                    data: null,
                    token: ''
                }
            }else{
                if(!emailData.isGoogleAuth) {
                    await this.userRepository.updateGoogleAuth(emailData._id as string, profilePic as string)
                }
                const token = this.JWTToken.generateToken(emailData._id as string)
                return {
                    status: 200,
                    message: 'Success',
                    data: emailData,
                    token
                }
            }
        }
    }


    async verifyLogin(email: string, password: string): Promise<AuthRes> {
        const userData = await this.userRepository.findByEmail(email)
        if (userData !== null) {
            if (userData.isBlocked) {
                return {
                    status: 400,
                    message: 'You are blocked by admin',
                    data: null,
                    token: ''
                }
            } else {
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password as string)
                if (passwordMatch) {
                    const token = this.JWTToken.generateToken(userData._id as string)
                    return {
                        status: 200,
                        message: 'Success',
                        data: userData,
                        token
                    }
                }else{
                    return {
                        status: 400,
                        message: 'Incorrect Password',
                        data: null,
                        token: ''
                    }
                }
            }
        }

        return {
            status: 400,
            message: 'Invalid email or password!',
            data: null,
            token: ''
        };

    }

    async getUsers(){
        return await this.userRepository.findAllUsers()
    }

    async blockUser(userId: string) {
        await this.userRepository.blockUnblockUser(userId)
    }
}