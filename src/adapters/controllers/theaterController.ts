import { Request, Response } from "express";
import { ITheaterAuth, ITheaterUpdate } from "../../application/interfaces/types/theater";
import { TheaterUseCase } from "../../application/useCases/theaterUseCase";
import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { TheaterShowLimit, maxDistance } from "../../infrastructure/constants/constants";
import { ITempTheaterReq } from "../../application/interfaces/types/tempTheater";
import { ICoords, ITheaterAddress } from "../../entities/common";



export class TheaterController {
    constructor(
        private readonly _theaterUseCase: TheaterUseCase
    ) { }

    // To save non-verified theater data temporarily and send otp for verification
    async theaterRegister(req: Request, res: Response) {
        const { name, email, password, liscenceId } = req.body as ITheaterAuth
        const { longitude, latitude } = req.body as { longitude: number, latitude: number }
        const { country, state, district, city, zip, landmark } = req.body as ITheaterAddress

        const address: ITheaterAddress = { country, state, district, city, zip, landmark }
        const coords: ICoords = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
        // console.log(coords, 'coords');
        const theaterData: ITempTheaterReq = { name, email, liscenceId, password, address, coords, otp: 0 }

        const authRes = await this._theaterUseCase.verifyAndSaveTemporarily(theaterData)
        res.status(authRes.status).json(authRes)
    }

    // To validate otp during registration
    async validateTheaterOTP(req: Request, res: Response) {
        const { otp } = req.body
        const authToken = req.headers.authorization;
        const validationRes = await this._theaterUseCase.validateAndSaveTheater(authToken, otp)
        res.status(validationRes.status).json(validationRes)
    }

    // To resend otp if current one is already expired
    async resendOTP(req:Request, res: Response) {
        const authToken = req.headers.authorization;
        const apiRes = await this._theaterUseCase.verifyAndSendNewOTP(authToken)
        res.status(apiRes.status).json(apiRes)
    }

    // To authenticate theater login using email and password
    async theaterLogin(req: Request, res: Response) {
        const { email, password } = req.body as ITheaterAuth
        const authData = await this._theaterUseCase.verifyLogin(email, password)
        res.status(authData.status).json(authData)
    }

    async loadTheaters(req: Request, res: Response) {
        try {
            const longitude = parseFloat(req.query.longitude as string)
            const latitude = parseFloat(req.query.latitude as string)

            // console.log('on load theateres controller', longitude, latitude);

            if (isNaN(longitude) || isNaN(latitude)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid coordinates' });
            }

            const nearestTheater = await this._theaterUseCase.getNearestTheatersByLimit(longitude, latitude, TheaterShowLimit, maxDistance)
            // console.log(nearestTheater);

            res.status(STATUS_CODES.OK).json({ message: 'Success', data: nearestTheater })
        } catch (error) {
            const err = error as Error
            res.status(400).json({ messge: err.message })
        }
    }

    // to update a theater data, used in profile edit
    async updateTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const { address, coords, mobile, name } = req.body as ITheaterUpdate
        const theater: ITheaterUpdate = { name, mobile, address, coords }
        const apiRes = await this._theaterUseCase.updateTheater(theaterId, theater)
        res.status(apiRes.status).json(apiRes)
    }

    async updateTheaterProfilePic (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const fileName = req.file?.filename
        const apiRes = await this._theaterUseCase.updateTheaterProfilePic(theaterId, fileName)
        res.status(apiRes.status).json(apiRes)
    }

    async removeTheaterProfilePic (req: Request, res: Response) { 
        const theaterId = req.params.theaterId
        const apiRes = await this._theaterUseCase.removeTheaterProfilePic(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    // To get all the data of a theater using theater id
    async getTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const apiRes = await this._theaterUseCase.getTheaterData(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async addToWallet (req: Request, res: Response) {
        const { theaterId } = req.params
        const amount: number = parseInt(req.body.amount)
        const apiRes = await this._theaterUseCase.addToWallet(theaterId, amount)
        res.status(apiRes.status).json(apiRes)
    }

    async getWalletHistory (req: Request, res: Response) {
        const { theaterId } = req.params
        const page = req.query.page as unknown as number
        const limit = req.query.limit as unknown as number
        const apiRes = await this._theaterUseCase.getWalletHistory(theaterId, page, limit)
        res.status(apiRes.status).json(apiRes)
    }

    async getRevenueData (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const apiRes = await this._theaterUseCase.getRevenueData(theaterId)
        res.status(apiRes.status).json(apiRes)
    }
}