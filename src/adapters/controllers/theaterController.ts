import { Request, Response } from "express";
import { ITheaterAuth, ITheaterUpdate } from "../../interfaces/schema/theaterSchema";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ICoords, ID, ITheaterAddress } from "../../interfaces/common";
import { STATUS_CODES } from "../../constants/httpStausCodes";
import { TheaterShowLimit, maxDistance } from "../../constants/constants";
import { ITempTheaterReq } from "../../interfaces/schema/tempTheaterSchema";



export class TheaterController {
    constructor(
        private theaterUseCase: TheaterUseCase
    ) { }

    async theaterRegister(req: Request, res: Response) {
        const { name, email, password, liscenceId } = req.body as ITheaterAuth
        const { longitude, latitude } = req.body as { longitude: number, latitude: number }
        const { country, state, district, city, zip, landmark } = req.body as ITheaterAddress

        const address: ITheaterAddress = { country, state, district, city, zip, landmark }
        const coords: ICoords = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
        console.log(coords, 'coords');
        const theaterData: ITempTheaterReq = { name, email, liscenceId, password, address, coords, otp: 0 }

        const authRes = await this.theaterUseCase.verifyAndSaveTemporarily(theaterData)
        res.status(authRes.status).json(authRes)
    }

    async validateTheaterOTP(req: Request, res: Response) {
        const { otp } = req.body
        const authToken = req.headers.authorization;
        const validationRes = await this.theaterUseCase.validateAndSaveTheater(authToken, otp)
        res.status(validationRes.status).json(validationRes)
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

    async theaterLogin(req: Request, res: Response) {
        const { email, password } = req.body as ITheaterAuth
        const authData = await this.theaterUseCase.verifyLogin(email, password)
        res.status(authData.status).json(authData)
    }

    async loadTheaters(req: Request, res: Response) {
        try {
            const longitude = parseFloat(req.query.longitude as string)
            const latitude = parseFloat(req.query.latitude as string)

            console.log('on load theateres controller', longitude, latitude);

            if (isNaN(longitude) || isNaN(latitude)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid coordinates' });
            }

            const nearestTheater = await this.theaterUseCase.getNearestTheatersByLimit(longitude, latitude, TheaterShowLimit, maxDistance)
            console.log(nearestTheater);

            res.status(STATUS_CODES.OK).json({ message: 'Success', data: nearestTheater })
        } catch (error) {
            const err = error as Error
            res.status(400).json({ messge: err.message })
        }
    }

    async updateTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const { address, coords, mobile, name } = req.body as ITheaterUpdate
        const theater: ITheaterUpdate = { name, mobile, address, coords }
        const apiRes = await this.theaterUseCase.updateTheater(theaterId, theater)
        res.status(apiRes.status).json(apiRes)
    }

    async getTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const apiRes = await this.theaterUseCase.getTheaterData(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

}