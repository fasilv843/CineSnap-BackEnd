import { Encrypt } from "../../providers/bcryptPassword";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { TheaterUseCase } from "../../useCases/theaterUseCase";



export class TheaterController {
    constructor (
        private theaterUseCase : TheaterUseCase,
        private mailer: MailSender,
        private otpGenerator : GenerateOtp,
        private encrypt : Encrypt
    ){}

    async theaterRegister (req:Request, res:Response){
        try {
            const { name, email, password, country, state, district, city, zip, liscenceId, landmark, latitude, longitude } = req.body;
            const isEmailExist = await this.theaterUseCase.isEmailExist(email);

            if(!isEmailExist){
                const OTP = this.otpGenerator.generateOTP()
                this.mailer.sendMail(email, OTP)
                console.log(OTP,'OTP');
                req.app.locals.OTP = OTP;
                // console.log(OTP, 'otp saved on app.locals');
                // console.log(req.app.locals.OTP,'app.locals.OTP');

                const securePassword = await this.encrypt.encryptPassword(password)
                const address = { country, state, district, city, zip }
                const coords = { latitude, longitude }
                const theaterData = { 
                    name, email, liscenceId, landmark, password: securePassword,
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
            const { email, password } = req.body
            const verifiedData = await this.theaterUseCase.verifyLogin(email, password)
            if(verifiedData?.data.token !== '' ){
                res.status(200).json({token: verifiedData?.data.token})
            }else{
                res.status(400).json({message: 'token not valid'})
            }
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