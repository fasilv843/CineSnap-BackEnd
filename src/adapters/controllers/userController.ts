import { NextFunction, Request, Response } from "express";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";

export class UserController {
    constructor (
        private userUseCase : UserUseCase,
        private mailer: MailSender,
        private otpGenerator : GenerateOtp,
        private encrypt : Encrypt
    ){}

    async userRegister (req:Request, res: Response){
        try {
            const { name, email, password } = req.body
            console.log(name, email, password);
            
            console.log(this,'this keyword logged');
            
            const isEmailExist = await this.userUseCase.isEmailExist(email)

            if(!isEmailExist){  
                const OTP = this.otpGenerator.generateOTP()
                console.log('sending mail');
                
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                req.app.locals.OTP = OTP;
                const securePassword = await this.encrypt.encryptPassword(password)
                req.app.locals.userData = { name, email, password:securePassword }
                res.status(200).send()
            }else{
                throw new Error("Email already Exist");
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
                console.log('user details saved, setting status 200');
                res.status(200).send()
            }else{
                console.log('otp didnt match');
                
                res.status(400).json({status: false, message: 'Invalid OTP'})
            }
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async resendOTP(req:Request, res: Response, next: NextFunction) {
        try {
            const OTP = this.otpGenerator.generateOTP()
            req.app.locals.OTP = OTP
            this.mailer.sendMail(req.app.locals.userData.email, OTP)
            res.status(200).json({message: 'OTP has been sent'})
        } catch (error) {
            next(error)
        }
    }

    async userLogin(req:Request, res: Response, next: NextFunction){
        try {
            const { email, password } = req.body
            const verifiedData = await this.userUseCase.verifyLogin(email, password)
            if(verifiedData?.data.token !== '' ){
                res.cookie('JWT',verifiedData?.data.token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
            }
        } catch (error) {
            next(error)
        }
    }

    async logout(req:Request, res: Response, next: NextFunction){
        try {
            res.cookie('JWT','',{
                httpOnly: true,
                expires: new Date()
            })
            res.status(200).json({message: 'user logged out'})
        } catch (error) {
            next(error)
        }

    }
}