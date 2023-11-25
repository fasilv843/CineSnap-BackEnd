// import { AuthRes } from "../Types/AuthRes";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { IApiAdminRes } from "../interfaces/schema/adminSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";


export class AdminUseCase {
    constructor(
        private encrypt : Encrypt,
        private adminRepository: AdminRepository,
        private jwtToken: JWTToken
    ){}

    async verifyLogin(email:string, password: string): Promise<IApiAdminRes>{
        const adminData = await this.adminRepository.findByEmail(email)
        if(adminData !== null){
            const passwordMatch = await this.encrypt.comparePasswords(password, adminData.password)
            if(passwordMatch){
                const token = this.jwtToken.generateToken(adminData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: adminData,
                    token
                }
            }else{
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email or Password',
                    data : null,
                    token: ''
                }
            }
        }else{
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email or Password',
                data: null,
                token: ''
            }
        }
    }
}