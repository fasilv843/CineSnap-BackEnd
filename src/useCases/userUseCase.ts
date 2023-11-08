import { UserRepository } from "../infrastructure/repositories/userRepository";
import { User } from "../interfaces/schemaInterface";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";



export class UserUseCase {
    constructor (
        private userRepository: UserRepository,
        private encrypt : Encrypt,
        private JWTToken : JWTToken
    ){}

    async isEmailExist (email:string):Promise<boolean> {
        const isUserExist = await this.userRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async saveUserDetails (userData:User){
        const user = await this.userRepository.saveUser(userData)
        return user;
    }

    async verifyLogin(email: string, password: string) {
        const userData = await this.userRepository.findByEmail(email)
        if(userData !== null) {
            if(userData.isBlocked){
                throw new Error('You are blocked by admin')
            }else{
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password)
                if(passwordMatch){
                    const token = this.JWTToken.generateToken(userData._id)
                    return {
                        status: 200,
                        data: { userData, token }
                    }
                }
            }
        }else{
            throw new Error('Invalid email or password')
        }
    }
}