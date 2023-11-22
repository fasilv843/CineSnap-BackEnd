import { Request, Response } from "express";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { IUser } from "../../interfaces/schema/userSchema";
import { OTP_TIMER } from "../../constants/constants";

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
            console.log(isEmailExist);
            if(isEmailExist === null){  
                const OTP = this.otpGenerator.generateOTP()
                
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                req.app.locals.OTP = OTP;
                setTimeout(() => {
                    req.app.locals.OTP = null
                }, OTP_TIMER)
                const securePassword = await this.encrypt.encryptPassword(password as string)
                req.app.locals.userData = { name, email, password:securePassword }
                res.status(200).json({message: 'Success'})
            }else{
                res.status(400).json({message: "Email already Exist"});
            }
        } catch (error) {
            console.log(error);
            
            // next(error)
        }
    }

    async validateUserOTP (req:Request, res: Response){
        try {
            console.log('validating otp');
            console.log(req.body.otp,'req.body.otp');
            console.log(req.app.locals.OTP,'req.app.locals.OTP');
            
            if(req.body.otp == req.app.locals.OTP){
                await this.userUseCase.saveUserDetails(req.app.locals.userData)
                req.app.locals.userData = null
                req.app.locals.OTP = null
                console.log('user details saved, setting status 200');
                res.status(200).json({message: 'Success'})
            }else{
                console.log('otp didnt match');
                res.status(400).json({status: false, message: 'Invalid OTP'})
            }
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async resendOTP(req:Request, res: Response) {
        try {
            const OTP = this.otpGenerator.generateOTP()
            req.app.locals.OTP = OTP
            console.log(OTP, 'resend otp');
            
            setTimeout(() => {
                req.app.locals.OTP = null
            }, OTP_TIMER * 1000)
            console.log(req.app.locals.userData, 'userData');
            
            this.mailer.sendMail(req.app.locals.userData.email, OTP)
            res.status(200).json({message: 'OTP has been sent'})
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
            const authData = await this.userUseCase.handleSocialSignUp(name, email, profilePic)
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