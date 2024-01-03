import { Request, Response } from "express";
import { UserUseCase } from "../../useCases/userUseCase";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { IUser, IUserAuth, IUserSocialAuth, IUserUpdate } from "../../interfaces/schema/userSchema";
import { ITempUserReq } from "../../interfaces/schema/tempUserSchema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { STATUS_CODES } from "../../constants/httpStausCodes";
import { ID } from "../../interfaces/common";


export class UserController {
    constructor (
        private readonly userUseCase : UserUseCase,
        private readonly otpGenerator : GenerateOtp,
        private readonly encrypt : Encrypt
    ){}

    async userRegister (req:Request, res: Response){
        try {
            const { name, email, password } = req.body as IUserAuth
            // console.log(name, email, password);
        
            const isEmailExist = await this.userUseCase.isEmailExist(email)
            if(isEmailExist === null){  
                const OTP = this.otpGenerator.generateOTP()
                
                // console.log(OTP,'OTP');
                const securePassword = await this.encrypt.encryptPassword(password)
                const user: ITempUserReq = { name, email, password: securePassword, otp:OTP }
                const tempUser = await this.userUseCase.saveUserTemporarily(user)

                this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP)

                // console.log('responding with 200');
                res.status(STATUS_CODES.OK).json({message: 'Success', token: tempUser.userAuthToken })
            }else{
                res.status(STATUS_CODES.FORBIDDEN).json({message: "Email already Exist"});
            }
        } catch (error) {
            console.log(error);
            console.log('error while register');
        }
    }

    async validateUserOTP (req:Request, res: Response){
        try {
            console.log('validating otp');
            console.log(req.body.otp,'req.body.otp');
            const { otp } = req.body
            const authToken = req.headers.authorization;
            // console.log(authToken, 'authToken from validate otp');
            
            if(authToken){
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const user = await this.userUseCase.findTempUserById(decoded.id)
                if(user){
                    if(otp == user.otp){
                        const savedData = await this.userUseCase.saveUserDetails({
                            name: user.name,
                            email: user.email,
                            password: user.password
                        }) 
                        console.log('user details saved, setting status 200');
                        res.status(savedData.status).json(savedData)
                    }else{
                        console.log('otp didnt match');
                        res.status(STATUS_CODES.UNAUTHORIZED).json({message: 'Invalid OTP'})
                    }
                } else {
                    res.status(STATUS_CODES.UNAUTHORIZED).json({message: 'Timeout, Register again'})
                }
            }else{
                res.status(STATUS_CODES.UNAUTHORIZED).json({message: 'authToken missing, Register again'})
            }

        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async resendOTP(req:Request, res: Response) {
        try {

            const authToken = req.headers.authorization;
            // console.log(authToken, 'authToken from resend otp');
            if(authToken){
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const tempUser = await this.userUseCase.findTempUserById(decoded.id)
                if(tempUser){
                    const OTP = this.otpGenerator.generateOTP()
                    // console.log(tempUser, 'userData');
                    console.log(OTP, 'new resend otp');
                    await this.userUseCase.updateOtp(tempUser._id, tempUser.email, OTP)
                    this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP)
                    res.status(STATUS_CODES.OK).json({message: 'OTP has been sent'})
                } else {
                    res.status(STATUS_CODES.UNAUTHORIZED).json({message: 'user timeout, register again'})
                }
            } else {
                res.status(STATUS_CODES.UNAUTHORIZED).json({message: 'AuthToken missing'})
            }

        } catch (error) {
            const err = error as Error
            console.log(error);
            res.status(500).json({message: err.message})
        }
    }

    async userLogin(req:Request, res: Response){
        try {
            const { email, password } = req.body as IUser
            const authData = await this.userUseCase.verifyLogin(email, password as string)
            res.status(authData.status).json(authData)
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async userSocialSignUp( req: Request, res: Response){
        try {
            const { name, email, profilePic } = req.body as IUserSocialAuth
            const authData = await this.userUseCase.handleSocialSignUp(name, email, profilePic as string)
            res.status(authData.status).json(authData)
        } catch (error) {
            const err = error as Error
            res.status(500).json({message: err.message })
        }
    }

    // to get user data using userId
    async getUserData (req:Request, res: Response) {
        const userId: ID = req.params.userId as unknown as ID
        const apiRes = await this.userUseCase.getUserData(userId)
        res.json(apiRes.status).json(apiRes)
    }

    // To update user details from profile
    async updateProfile(req: Request, res: Response) {
        const user = req.body as IUserUpdate
        const userId: ID = req.params.userId as unknown as ID
        const apiRes = await this.userUseCase.updateUserData(userId, user)
        res.status(apiRes.status).json(apiRes)
    }

    async updateUserProfileDp (req: Request, res: Response) {
        const userId: ID = req.params.userId as unknown as ID
        const fileName = req.file?.filename
        const apiRes = await this.userUseCase.updateUserProfilePic(userId, fileName)
        res.status(apiRes.status).json(apiRes)
    }

    async removeUserProfileDp (req: Request, res: Response) { 
        const userId: ID = req.params.userId as unknown as ID
        const apiRes = await this.userUseCase.removeUserProfileDp(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async addToWallet (req: Request, res: Response) {
        const { userId } = req.params as unknown as { userId: ID }
        const amount: number = parseInt(req.body.amount)
        const apiRes = await this.userUseCase.addToWallet(userId, amount)
        res.status(apiRes.status).json(apiRes)
    }

    async getWalletHistory (req: Request, res: Response) {
        const { userId } = req.params as unknown as { userId: ID }
        const page = req.query.page as unknown as number
        const limit = req.query.limit as unknown as number
        const apiRes = await this.userUseCase.getWalletHistory(userId, page, limit)
        res.status(apiRes.status).json(apiRes)
    }
}