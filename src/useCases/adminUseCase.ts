// import { AuthRes } from "../Types/AuthRes";
import { STATUS_CODES } from "../infrastructure/constants/httpStausCodes";
import { IApiAdminAuthRes } from "../interfaces/schema/adminSchema";
import { IAdminRepo } from "./repos/adminRepo";
import { IEncryptor } from "./utils/encryptor";
import { ITokenGenerator } from "./utils/tokenGenerator";


export class AdminUseCase {
    constructor(
        private readonly _encryptor : IEncryptor,
        private readonly _adminRepository: IAdminRepo,
        private readonly _tokenGenerator: ITokenGenerator
    ){}

    async verifyLogin(email:string, password: string): Promise<IApiAdminAuthRes>{
        const adminData = await this._adminRepository.findAdmin()
        if(adminData !== null){
            const passwordMatch = await this._encryptor.comparePasswords(password, adminData.password)
            if(passwordMatch){
                const accessToken = this._tokenGenerator.generateAccessToken(adminData._id)
                const refreshToken = this._tokenGenerator.generateRefreshToken(adminData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: adminData,
                    accessToken,
                    refreshToken
                }
            }else{
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email or Password',
                    data : null,
                    accessToken: '',
                    refreshToken: ''
                }
            }
        }else{
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email or Password',
                data: null,
                accessToken: '',
                refreshToken: ''
            }
        }
    }
}