import { log } from "console";
import { OTP_TIMER } from "../infrastructure/constants/constants";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { IApiRes, IWalletHistoryAndCount } from "../interfaces/common";
import { ITempUserReq, ITempUserRes } from "../interfaces/schema/tempUserSchema";
import { IApiUserAuthRes, IApiUserRes, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate, IUsersAndCount } from "../interfaces/schema/userSchema";
import path from "path";
import fs from 'fs'
import { IUser } from "../entities/user";
import { IEncryptor } from "./utils/encryptor";
import { ITokenGenerator } from "./utils/tokenGenerator";
import { IMailSender } from "./utils/mailSender";
import { IUserRepo } from "./repos/userRepo";
import { ITempUserRepo } from "./repos/tempUserRepo";


export class UserUseCase {
    constructor(
        private readonly _userRepository: IUserRepo,
        private readonly _tempUserRepository: ITempUserRepo,
        private readonly _encryptor: IEncryptor,
        private readonly _tokenGenerator: ITokenGenerator,
        private readonly _mailer: IMailSender,
    ) { }

    async isEmailExist(email: string): Promise<IUser | null> {
        const isUserExist = await this._userRepository.findByEmail(email)
        return isUserExist
    }

    async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<IApiUserAuthRes> {
        const user = await this._userRepository.saveUser(userData)
        // console.log('user data saved, on usecase', user);
        const accessToken = this._tokenGenerator.generateAccessToken(user._id)
        const refreshToken = this._tokenGenerator.generateRefreshToken(user._id)
        return {
            status: STATUS_CODES.OK,
            data: user,
            message: 'Success',
            accessToken,
            refreshToken
        }
    }

    async saveUserTemporarily(userData: ITempUserReq): Promise<ITempUserRes & { userAuthToken: string}> {
        const user = await this._tempUserRepository.saveUser(userData)
        // console.log(user, 'temp user saved');
        const userAuthToken = this._tokenGenerator.generateTempToken(user._id) 
        return { ...JSON.parse(JSON.stringify(user)), userAuthToken} 
    }

    async updateOtp(id: string, email: string, OTP: number) {
        return await this._tempUserRepository.updateOTP(id, email, OTP)
    }

    async findTempUserById(id: string){
        return await this._tempUserRepository.findById(id)
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
                    await this._userRepository.updateGoogleAuth(emailData._id, profilePic)
                }
                const accessToken = this._tokenGenerator.generateAccessToken(emailData._id)
                const refreshToken = this._tokenGenerator.generateRefreshToken(emailData._id)
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
    sendTimeoutOTP(id: string, email: string, OTP: number) {
        try {
            this._mailer.sendOTP(email, OTP)
                    
            setTimeout(async() => {
                await this._tempUserRepository.unsetOtp(id, email)
            }, OTP_TIMER)

        } catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp')
        }
    }


    async verifyLogin(email: string, password: string): Promise<IApiUserAuthRes> {
        const userData = await this._userRepository.findByEmail(email)
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
                const passwordMatch = await this._encryptor.comparePasswords(password, userData.password as string)
                if (passwordMatch) {
                const accessToken = this._tokenGenerator.generateAccessToken(userData._id)
                const refreshToken = this._tokenGenerator.generateRefreshToken(userData._id)
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
            const users = await this._userRepository.findAllUsers(page, limit, searchQuery)
            const userCount = await this._userRepository.findUserCount(searchQuery)
            return get200Response({ users, userCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async blockUser(userId: string) {
        try {
            await this._userRepository.blockUnblockUser(userId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUserData (userId: string): Promise<IApiUserRes> {
        try {
            const user = await this._userRepository.getUserData(userId)
            if(user) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserData (userId: string, user: IUserUpdate): Promise<IApiUserRes> {
        try {
            const updatedUser = await this._userRepository.updateUser(userId, user)
            return get200Response(updatedUser as IUserRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserProfilePic (userId: string, fileName: string | undefined): Promise<IApiUserRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(userId, fileName, 'userId, filename from use case')
            const user = await this._userRepository.findById(userId)
            // Deleting user dp if it already exist
            if (user && user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this._userRepository.updateUserProfilePic(userId, fileName)
            if (updatedUser) return get200Response(updatedUser)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async removeUserProfileDp (userId: string): Promise<IApiUserRes> {
        try {
            const user = await this._userRepository.findById(userId)
            if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
            // Deleting user dp if it already exist
            if (user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this._userRepository.removeUserProfileDp(userId)
            if (updatedUser) {
                return get200Response(updatedUser) 
            }
            
            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async addToWallet (userId: string, amount: number): Promise<IApiUserRes> {
        try {
            if (typeof amount !== 'number') return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number')
            const user = await this._userRepository.updateWallet(userId, amount, 'Added To Wallet')

            if (user !== null) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getWalletHistory (userId: string, page: number, limit: number): Promise<IApiRes<IWalletHistoryAndCount | null>> {
        try {
            const userWallet = await this._userRepository.getWalletHistory(userId, page, limit)
            if (userWallet) return get200Response(userWallet)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userid')
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}