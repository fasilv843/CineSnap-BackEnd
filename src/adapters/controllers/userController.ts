import { Request, Response } from "express";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { IUser } from "../../interfaces/schema/userSchema";
import { OTP_TIMER } from "../../constants/constants";
import { ITempUserReq } from "../../interfaces/schema/tempUserSchema";
import jwt, { JwtPayload } from "jsonwebtoken";


export class UserController {
    constructor (
        private userUseCase : UserUseCase,
        private mailer: MailSender,
        private otpGenerator : GenerateOtp,
        private encrypt : Encrypt
    ){}

    async userRegister (req:Request, res: Response){
        try {
            const { name, email, password } = req.body as IUser
            console.log(name, email, password);
        
            const isEmailExist = await this.userUseCase.isEmailExist(email)
            if(isEmailExist === null){  
                const OTP = this.otpGenerator.generateOTP()
                
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                const securePassword = await this.encrypt.encryptPassword(password as string)
                const user: ITempUserReq = { name, email, password: securePassword, otp:OTP }
                const tempUser = await this.userUseCase.saveUserTemporarily(user)

                setTimeout(async() => {
                    await this.userUseCase.unsetOtp(tempUser._id, tempUser.email)
                }, OTP_TIMER)
                console.log('responding with 200');
                res.status(200).json({message: 'Success', token: tempUser.userAuthToken })
            }else{
                res.status(400).json({message: "Email already Exist"});
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
            console.log(authToken, 'authToken from validate otp');
            
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
                        res.status(400).json({status: false, message: 'Invalid OTP'})
                    }
                } else {
                    res.status(400).json({status: false, message: 'Timeout, Register again'})
                }
            }else{
                res.status(400).json({status: false, message: 'authToken missing, Register again'})
            }

        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async resendOTP(req:Request, res: Response) {
        try {

            const authToken = req.headers.authorization;
            console.log(authToken, 'authToken from resend otp');
            if(authToken){
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const user = await this.userUseCase.findTempUserById(decoded.id)
                if(user){
                    const OTP = this.otpGenerator.generateOTP()
                    console.log(user, 'userData');
                    console.log(OTP, 'new resend otp');
                    await this.userUseCase.updateOtp(user._id, user.email, OTP)
                    this.mailer.sendMail(user.email, OTP)
                    
                    setTimeout(async() => {
                        await this.userUseCase.unsetOtp(user._id, user.email)
                    }, OTP_TIMER)
                    
                    res.status(200).json({message: 'OTP has been sent'})
                } else {
                    res.status(400).json({message: 'user timeout, register again'})
                }
            } else {
                res.status(400).json({message: 'AuthToken missing'})
            }

        } catch (error) {
            const err = error as Error
            console.log(error);
            res.status(500).json({message: err.message})
        }
    }

    async userLogin(req:Request, res: Response){
        try {
            const { email, password } = req.body as IUser & { isSocialSignUp: boolean}
            const authData = await this.userUseCase.verifyLogin(email, password as string)
            res.status(authData.status).json(authData)
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async userSocialSignUp( req: Request, res: Response){
        try {
            const { name, email, profilePic } = req.body as IUser
            const authData = await this.userUseCase.handleSocialSignUp(name, email, profilePic as string)
            res.status(authData.status).json(authData)
        } catch (error) {
            const err = error as Error
            res.status(500).json({message: err.message })
        }
    }

    async logout(req:Request, res: Response){
        try {
            res.cookie('JWT','',{
                httpOnly: true,
                expires: new Date()
            })
            res.status(200).json({message: 'user logged out'})
        } catch (error) {
            console.log(error);
            // next(error)
        }

    }
}