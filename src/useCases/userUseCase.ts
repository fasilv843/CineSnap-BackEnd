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

    async isEmailExist(email: string): Promise<boolean> {
        const isUserExist = await this.userRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async saveUserDetails(userData: IUser) {
        const user = await this.userRepository.saveUser(userData)
        return user;
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
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password)
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