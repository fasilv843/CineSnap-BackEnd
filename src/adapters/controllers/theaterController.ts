import { Request, Response } from "express";
import { ITheaterAuth, ITheaterUpdate } from "../../interfaces/schema/theaterSchema";
import { Encrypt } from "../../providers/bcryptPassword";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ICoords, ID, ITheaterAddress } from "../../interfaces/common";
import { STATUS_CODES } from "../../constants/httpStausCodes";
import { TheaterShowLimit, maxDistance } from "../../constants/constants";



export class TheaterController {
    constructor (
        private theaterUseCase : TheaterUseCase,
        private mailer: MailSender,
        private otpGenerator : GenerateOtp,
        private encrypt : Encrypt
    ){}

    async theaterRegister (req:Request, res:Response){
        try {
            const { name, email, password, liscenceId } = req.body as ITheaterAuth
            const { longitude, latitude } = req.body as { longitude: number, latitude: number }
            const { country, state, district, city, zip, landmark  } = req.body as ITheaterAddress

            console.log(longitude, latitude);
            
            const isEmailExist = await this.theaterUseCase.isEmailExist(email);

            if(!isEmailExist){
                const OTP = this.otpGenerator.generateOTP()
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                req.app.locals.OTP = OTP;

                const securePassword = await this.encrypt.encryptPassword(password)
                const address: ITheaterAddress = { country, state, district, city, zip, landmark }
                const coords: ICoords = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                } 
                const theaterData: ITheaterAuth = { 
                    name, email, liscenceId, password: securePassword,
                    address, coords
                }
                
                req.app.locals.theaterData = theaterData;
                res.status(STATUS_CODES.OK).json({message: 'OTP Successfully sent'})
            }else{
                res.status(400).json({message: 'Email Already Exist in CineSnap'})
            }

        } catch (error) {
            console.log(error);
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
                res.status(STATUS_CODES.OK).json()
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
            const { email, password } = req.body as ITheaterAuth
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

    async loadTheaters (req: Request, res: Response) {
        try {
            const longitude = parseFloat(req.query.longitude as string)
            const latitude = parseFloat(req.query.latitude as string)

            console.log('on load theateres controller', longitude, latitude);
            
            if ( isNaN(longitude) || isNaN(latitude) ) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid coordinates' });
            }

            const nearestTheater = await this.theaterUseCase.getNearestTheatersByLimit(longitude, latitude, TheaterShowLimit, maxDistance)
            console.log(nearestTheater);
            
            res.status(STATUS_CODES.OK).json({message: 'Success', data: nearestTheater})
        } catch (error) {
            const err = error as Error
            res.status(400).json({messge: err.message})
        }
    }

    async updateTheaterData (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const { address, coords, mobile, name } = req.body as ITheaterUpdate
        const theater: ITheaterUpdate = { name, mobile, address, coords }
        const apiRes = await this.theaterUseCase.updateTheater(theaterId, theater)
        res.status(apiRes.status).json(apiRes)
    }

}