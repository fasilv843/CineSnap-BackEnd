// import { AuthRes } from "../Types/AuthRes";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { ID } from "../interfaces/common";
import { ITempUserReq, ITempUserRes } from "../interfaces/schema/tempUserSchema";
import { IApiUserAuthRes, IApiUserRes, IApiUsersRes, IUser, IUserAuth, IUserSocialAuth, IUserUpdate } from "../interfaces/schema/userSchema";
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

    async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<IApiUserAuthRes> {
        const user = await this.userRepository.saveUser(userData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const userRes: IUserRes = (({ ['password']: _, ...rest }) => rest)(user);
        console.log('user data saved, on usecase', user);
        const accessToken = this.jwt.generateAccessToken(user._id)
        const refreshToken = this.jwt.generateRefreshToken(user._id)
        return {
            status: STATUS_CODES.OK,
            data: user,
            message: 'Success',
            accessToken,
            refreshToken
        }
    }

    async saveUserTemporarily(userData: ITempUserReq): Promise<ITempUserRes & { userAuthToken: string}> {
        const user = await this.tempUserRepository.saveUser(userData)
        console.log(user, 'temp user saved');
        const userAuthToken = this.jwt.generateTempToken(user._id) 
        return { ...JSON.parse(JSON.stringify(user)), userAuthToken} 
    }

    // async unsetOtp(id: ID, email: string) {
    //     return await this.tempUserRepository.unsetOtp(id, email)
    // }

    async updateOtp(id: ID, email: string, OTP: number) {
        return await this.tempUserRepository.updateOTP(id, email, OTP)
    }

    async findTempUserById(id: ID){
        return await this.tempUserRepository.findById(id)
    }

    async handleSocialSignUp(name: string, email: string, profilePic: string | undefined): Promise<IApiUserAuthRes>{
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
                    accessToken: '',
                    refreshToken: ''
                }
            }else{
                if(!emailData.isGoogleAuth) {
                    await this.userRepository.updateGoogleAuth(emailData._id, profilePic)
                }
                const accessToken = this.jwt.generateAccessToken(emailData._id)
                const refreshToken = this.jwt.generateRefreshToken(emailData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: emailData,
                    accessToken,
                    refreshToken
                }
            }
        }
    }

    // To send an otp to user that will expire after a certain period
    sendTimeoutOTP(id: ID, email: string, OTP: number) {
        try {
            this.mailer.sendMail(email, OTP)
                    
            setTimeout(async() => {
                await this.tempUserRepository.unsetOtp(id, email)
            }, OTP_TIMER)

        } catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp')
        }
    }


    async verifyLogin(email: string, password: string): Promise<IApiUserAuthRes> {
        const userData = await this.userRepository.findByEmail(email)
        if (userData !== null) {
            if (userData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You are blocked by admin',
                    data: null,
                    accessToken: '',
                    refreshToken: ''
                }
            } else {
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password as string)
                if (passwordMatch) {
                const accessToken = this.jwt.generateAccessToken(userData._id)
                const refreshToken = this.jwt.generateRefreshToken(userData._id)
                    return {
                        status: STATUS_CODES.OK,
                        message: 'Success',
                        data: userData,
                        accessToken,
                        refreshToken
                    }
                }else{
                    return {
                        status: STATUS_CODES.UNAUTHORIZED,
                        message: 'Incorrect Password',
                        data: null,
                        accessToken: '',
                        refreshToken: ''
                    }
                }
            }
        }

        return {
            status: STATUS_CODES.UNAUTHORIZED,
            message: 'Invalid email or password!',
            data: null,
            accessToken: '',
            refreshToken: ''
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

    async getUserData (userId: ID): Promise<IApiUserRes> {
        try {
            const user = await this.userRepository.getUserData(userId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: user,
                token: ''
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }

    async updateUserData (userId: ID, user: IUserUpdate): Promise<IApiUserRes> {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, user)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: updatedUser,
                token: ''
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }
}