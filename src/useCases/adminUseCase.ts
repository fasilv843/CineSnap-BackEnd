import { AuthRes } from "../Types/AuthRes";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";


export class AdminUseCase {
    constructor(
        private encrypt : Encrypt,
        private adminRepository: AdminRepository,
        private jwtToken: JWTToken
    ){}

    async verifyLogin(email:string, password: string): Promise<AuthRes>{
        const adminData = await this.adminRepository.findByEmail(email)
        if(adminData !== null){
            const passwordMatch = await this.encrypt.comparePasswords(password, adminData.password)
            if(passwordMatch){
                const token = this.jwtToken.generateToken(adminData._id as string)
                return {
                    status: 200,
                    message: 'Success',
                    data: adminData,
                    token
                }
            }else{
                return {
                    status: 400,
                    message: 'Invalid Email or Password',
                    data : null,
                    token: ''
                }
            }
        }else{
            return {
                status: 400,
                message: 'Invalid Email or Password',
                data: null,
                token: ''
            }
        }
    }
}