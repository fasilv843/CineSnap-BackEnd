// import { AuthRes } from "../Types/AuthRes";
import { log } from "console";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { IApiRes, ID, IWalletHistoryAndCount } from "../interfaces/common";
import { ITempUserReq, ITempUserRes } from "../interfaces/schema/tempUserSchema";
import { IApiUserAuthRes, IApiUserRes, IUser, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate, IUsersAndCount } from "../interfaces/schema/userSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";
import path from "path";
import fs from 'fs'


export class UserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tempUserRepository: TempUserRepository,
        private readonly encrypt: Encrypt,
        private readonly jwt: JWTToken,
        private readonly mailer: MailSender,
    ) { }

    async isEmailExist(email: string): Promise<IUser | null> {
        const isUserExist = await this.userRepository.findByEmail(email)
        return isUserExist
    }

    async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<IApiUserAuthRes> {
        const user = await this.userRepository.saveUser(userData)
        // console.log('user data saved, on usecase', user);
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
        // console.log(user, 'temp user saved');
        const userAuthToken = this.jwt.generateTempToken(user._id) 
        return { ...JSON.parse(JSON.stringify(user)), userAuthToken} 
    }

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
            this.mailer.sendOTP(email, OTP)
                    
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

    async getAllUsers(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<IUsersAndCount | null>>{
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            if (!searchQuery) searchQuery = ''
            const users = await this.userRepository.findAllUsers(page, limit, searchQuery)
            const userCount = await this.userRepository.findUserCount(searchQuery)
            return get200Response({ users, userCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async blockUser(userId: string) {
        try {
            await this.userRepository.blockUnblockUser(userId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUserData (userId: ID): Promise<IApiUserRes> {
        try {
            const user = await this.userRepository.getUserData(userId)
            if(user) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserData (userId: ID, user: IUserUpdate): Promise<IApiUserRes> {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, user)
            return get200Response(updatedUser as IUserRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserProfilePic (userId: ID, fileName: string | undefined): Promise<IApiUserRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(userId, fileName, 'userId, filename from use case')
            const user = await this.userRepository.findById(userId)
            // Deleting user dp if it already exist
            if (user && user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this.userRepository.updateUserProfilePic(userId, fileName)
            if (updatedUser) return get200Response(updatedUser)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async removeUserProfileDp (userId: ID): Promise<IApiUserRes> {
        try {
            const user = await this.userRepository.findById(userId)
            if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
            // Deleting user dp if it already exist
            if (user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this.userRepository.removeUserProfileDp(userId)
            if (updatedUser) {
                return get200Response(updatedUser) 
            }
            
            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async addToWallet (userId: ID, amount: number): Promise<IApiUserRes> {
        try {
            if (typeof amount !== 'number') return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number')
            const user = await this.userRepository.updateWallet(userId, amount, 'Added To Wallet')

            if (user !== null) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getWalletHistory (userId: ID, page: number, limit: number): Promise<IApiRes<IWalletHistoryAndCount | null>> {
        try {
            const userWallet = await this.userRepository.getWalletHistory(userId, page, limit)
            if (userWallet) return get200Response(userWallet)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userid')
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}