// import { AuthRes } from "../Types/AuthRes";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { ITempUserReq, ITempUserRes } from "../interfaces/schema/tempUserSchema";
import { IApiUserRes, IApiUsersRes, IUser, IUserAuth, IUserSocialAuth } from "../interfaces/schema/userSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";



export class UserUseCase {
    constructor(
        private userRepository: UserRepository,
        private tempUserRepository: TempUserRepository,
        private encrypt: Encrypt,
        private jwt: JWTToken,
        private mailer: MailSender,
    ) { }

    async isEmailExist(email: string): Promise<IUser | null> {
        const isUserExist = await this.userRepository.findByEmail(email)
        return isUserExist
    }

    async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<IApiUserRes> {
        const user = await this.userRepository.saveUser(userData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const userRes: IUserRes = (({ ['password']: _, ...rest }) => rest)(user);
        console.log('user data saved, on usecase', user);
        const token = this.jwt.generateToken(user._id)
        return {
            status: STATUS_CODES.OK,
            data: user,
            message: 'Success',
            token
        }
    }

    async saveUserTemporarily(userData: ITempUserReq): Promise<ITempUserRes & { userAuthToken: string}> {
        const user = await this.tempUserRepository.saveUser(userData)
        console.log(user, 'temp user saved');
        const userAuthToken = this.jwt.generateToken(user._id) 
        return { ...JSON.parse(JSON.stringify(user)), userAuthToken} 
    }

    async unsetOtp(id: string, email: string) {
        return await this.tempUserRepository.unsetOtp(id, email)
    }

    async updateOtp(id: string, email: string, OTP: number) {
        return await this.tempUserRepository.updateOTP(id, email, OTP)
    }

    async findTempUserById(id: string){
        return await this.tempUserRepository.findById(id)
    }

    async handleSocialSignUp(name: string, email: string, profilePic: string | undefined){
        const emailData = await this.isEmailExist(email)
        if(emailData === null){
            const userToSave = { name, email, profilePic, isGoogleAuth: true }
            const savedData = await this.saveUserDetails(userToSave)
            console.log('user details saved');
            return savedData
        } else {
            if(emailData.isBlocked){
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You are blocked by admin',
                    data: null,
                    token: ''
                }
            }else{
                if(!emailData.isGoogleAuth) {
                    await this.userRepository.updateGoogleAuth(emailData._id, profilePic)
                }
                const token = this.jwt.generateToken(emailData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: emailData,
                    token
                }
            }
        }
    }

    sendTimeoutOTP(id: string, email: string, OTP: number) {
        try {
            this.mailer.sendMail(email, OTP)
                    
            setTimeout(async() => {
                await this.unsetOtp(id, email)
            }, OTP_TIMER)

        } catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp')
        }
    }


    async verifyLogin(email: string, password: string): Promise<IApiUserRes> {
        const userData = await this.userRepository.findByEmail(email)
        if (userData !== null) {
            if (userData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You are blocked by admin',
                    data: null,
                    token: ''
                }
            } else {
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password as string)
                if (passwordMatch) {
                    const token = this.jwt.generateToken(userData._id)
                    return {
                        status: STATUS_CODES.OK,
                        message: 'Success',
                        data: userData,
                        token
                    }
                }else{
                    return {
                        status: STATUS_CODES.UNAUTHORIZED,
                        message: 'Incorrect Password',
                        data: null,
                        token: ''
                    }
                }
            }
        }

        return {
            status: STATUS_CODES.UNAUTHORIZED,
            message: 'Invalid email or password!',
            data: null,
            token: ''
        };

    }

    async getUsers(): Promise<IApiUsersRes>{
        try {
            const users = await this.userRepository.findAllUsers()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: users,
                token: ''
            }
        } catch (error) {
            console.log(error);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
                data: [],
                token: ''
            }
        }
    }

    async blockUser(userId: string) {
        await this.userRepository.blockUnblockUser(userId)
    }
}