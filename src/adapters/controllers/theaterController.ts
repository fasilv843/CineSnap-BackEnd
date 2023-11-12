import { Request, Response } from "express";
import { ITheater } from "../../interfaces/schema/theaterSchema";
import { Encrypt } from "../../providers/bcryptPassword";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { IAddress, ILocation } from "../../interfaces/schema/common";



export class TheaterController {
    constructor (
        private theaterUseCase : TheaterUseCase,
        private mailer: MailSender,
        private otpGenerator : GenerateOtp,
        private encrypt : Encrypt
    ){}

    async theaterRegister (req:Request, res:Response){
        try {
            const { name, email, password, liscenceId } = req.body as ITheater
            const { latitude, longitude } = req.body as ILocation
            const { country, state, district, city, zip, landmark  } = req.body as IAddress

            const isEmailExist = await this.theaterUseCase.isEmailExist(email);

            if(!isEmailExist){
                const OTP = this.otpGenerator.generateOTP()
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                req.app.locals.OTP = OTP;

                const securePassword = await this.encrypt.encryptPassword(password)
                const address: IAddress = { country, state, district, city, zip, landmark }
                const coords: ILocation = { latitude, longitude }
                const theaterData: ITheater = { 
                    name, email, liscenceId, password: securePassword,
                    address, coords
                }
                
                req.app.locals.theaterData = theaterData;
                res.status(200).json({message: 'OTP Successfully sent'})
            }else{
                res.status(400).json({message: 'Email Already Exist in CineSnap'})
            }

        } catch (error) {
            res.status(400).json({message: 'Error While registering'})
        }
    }

    async validateTheaterOTP (req:Request, res:Response){
        try {
            console.log(req.body?.otp, req.app.locals.OTP)
            console.log(req.body);
            if(req.body?.otp == req.app.locals.OTP){
                await this.theaterUseCase.saveTheater(req.app.locals.theaterData)
                req.app.locals.theaterData = null
                console.log('user details saved, setting status 200');
                res.status(200).send()
            }else{
                console.log('otp didnt match');
                res.status(400).json({status: false, message: 'Invalid OTP'})
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    // async resendOTP(req:Request, res: Response) {
    //     try {
    //         const OTP = this.otpGenerator.generateOTP()
    //         req.app.locals.OTP = OTP
    //         this.mailer.sendMail(req.app.locals.userData.email, OTP)
    //         res.status(200).json({message: 'OTP has been sent'})
    //     } catch (error) {
    //         console.log(error);
    //         // next(error)
    //     }
    // }

    async theaterLogin (req:Request, res:Response){
        try {
            const { email, password } = req.body as ITheater
            const authData = await this.theaterUseCase.verifyLogin(email, password)
            res.status(authData.status).json(authData)
        } catch (error) {
            console.log(error);
        }
    }

    
    // async logout(req:Request, res: Response){
    //     try {
    //         res.cookie('JWT','',{
    //             httpOnly: true,
    //             expires: new Date()
    //         })
    //         res.status(200).json({message: 'user logged out'})
    //     } catch (error) {
    //         console.log(error);
    //         // next(error)
    //     }
    // }

}