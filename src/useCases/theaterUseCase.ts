import { log } from "console";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempTheaterRepository } from "../infrastructure/repositories/tempTheaterRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { IApiAuthRes, IApiRes, IApiTempAuthRes, ID } from "../interfaces/common";
import { IApiTempTheaterRes, ITempTheaterReq, ITempTheaterRes } from "../interfaces/schema/tempTheaterSchema";
import { IApiTheaterAuthRes, IApiTheaterRes, ITheaterUpdate, ITheatersAndCount } from "../interfaces/schema/theaterSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";
import { GenerateOtp } from "../providers/otpGenerator";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";
import fs from 'fs'


export class TheaterUseCase {
    constructor(
        private readonly theaterRepository: TheaterRepository,
        private readonly tempTheaterRepository: TempTheaterRepository,
        private readonly encrypt: Encrypt,
        private readonly jwtToken: JWTToken,
        private readonly mailer: MailSender,
        private readonly otpGenerator: GenerateOtp,
    ) { }

    async verifyAndSaveTemporarily(theaterData: ITempTheaterReq): Promise<IApiTempAuthRes<ITempTheaterRes>> {
        try {
            const isEmailExist = await this.isEmailExist(theaterData.email);
            if (isEmailExist) {
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Email Already Exist')
            } else {
                theaterData.otp = this.otpGenerator.generateOTP()
                theaterData.password = await this.encrypt.encryptPassword(theaterData.password)

                const tempTheater = await this.tempTheaterRepository.saveTheater(theaterData)
                this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp)
                const userAuthToken = this.jwtToken.generateTempToken(tempTheater._id)

                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: tempTheater,
                    token: userAuthToken
                }
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    sendTimeoutOTP(id: ID, email: string, OTP: number) {
        console.log(OTP, 'otp from sendTimoutOTP');
        this.mailer.sendOTP(email, OTP)

        setTimeout(async () => {
            await this.tempTheaterRepository.unsetTheaterOTP(id, email)
        }, OTP_TIMER)
    }

    async verifyAndSendNewOTP(authToken: string | undefined): Promise<IApiTempTheaterRes> {
        try {
            if (authToken) {
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const tempTheater = await this.tempTheaterRepository.findTempTheaterById(decoded.id)
                if (tempTheater) {
                    const newOTP = this.otpGenerator.generateOTP()
                    await this.tempTheaterRepository.updateTheaterOTP(tempTheater._id, tempTheater.email, newOTP)
                    this.sendTimeoutOTP(tempTheater._id, tempTheater.email, newOTP)
                    return get200Response(null)
                } else {
                    return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Unautherized')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Token in missing')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async validateAndSaveTheater(authToken: string | undefined, otp: number): Promise<IApiAuthRes> {
        try {
            if (authToken) {
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const theater = await this.tempTheaterRepository.findTempTheaterById(decoded.id)
                if (theater) {
                    if (otp == theater.otp) {
                        const savedTheater = await this.theaterRepository.saveTheater(theater)
                        const accessToken = this.jwtToken.generateAccessToken(savedTheater._id)
                        const refreshToken = this.jwtToken.generateRefreshToken(savedTheater._id)
                        return {
                            status: STATUS_CODES.OK,
                            message: 'Success',
                            data: savedTheater,
                            accessToken,
                            refreshToken
                        }
                    } else {
                        return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Incorrect OTP')
                    }
                } else {
                    return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Unautherized')
                }
            } else {
                return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Token is Missing')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // async saveTheater(theaterData: ITheater): Promise<ITheater> {
    //     return await this.theaterRepository.saveTheater(theaterData)
    // }

    async isEmailExist(email: string): Promise<boolean> {
        const isUserExist = await this.theaterRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async verifyLogin(email: string, password: string): Promise<IApiTheaterAuthRes> {
        const theaterData = await this.theaterRepository.findByEmail(email)
        if (theaterData !== null) {

            if (theaterData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You have been blocked by admin',
                    data: null,
                    accessToken: '',
                    refreshToken: ''
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if (passwordMatch) {
                const accessToken = this.jwtToken.generateAccessToken(theaterData._id)
                const refreshToken = this.jwtToken.generateRefreshToken(theaterData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: theaterData,
                    accessToken,
                    refreshToken
                }
            } else {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Incorrect Password',
                    data: null,
                    accessToken: '',
                    refreshToken: ''
                }
            }
        } else {
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email',
                data: null,
                accessToken: '',
                refreshToken: ''
            }
        }
    }

    async getAllTheaters(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<ITheatersAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            if (!searchQuery) searchQuery = ''
            const theaters = await this.theaterRepository.findAllTheaters(page, limit, searchQuery)
            const theaterCount = await this.theaterRepository.findTheaterCount(searchQuery)
            return get200Response({ theaters, theaterCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async blockTheater(theaterId: string) {
        return await this.theaterRepository.blockTheater(theaterId)
    }

    async getNearestTheaters(lon: number, lat: number, radius: number) {
        return await this.theaterRepository.getNearestTheaters(lon, lat, radius)
    }

    async getNearestTheatersByLimit(lon: number, lat: number, limit: number, maxDistance: number) {
        return await this.theaterRepository.getNearestTheatersByLimit(lon, lat, limit, maxDistance)
    }

    // To update theater data, from theater profile
    async updateTheater(theaterId: ID, theater: ITheaterUpdate): Promise<IApiTheaterRes> {
        try {
            const theaterData = await this.theaterRepository.updateTheater(theaterId, theater)
            if (theaterData !== null) {
                return get200Response(theaterData)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, theaterId is not availble')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To get theater data using theaterId
    async getTheaterData(theaterId: ID): Promise<IApiTheaterRes> {
        try {
            if (theaterId === undefined) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            const theater = await this.theaterRepository.findById(theaterId)
            if (theater === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            return get200Response(theater)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To approve or reject theater for admin when they register
    async theaterApproval(theaterId: ID, action: string | undefined): Promise<IApiTheaterRes> {
        try {
            if (action !== 'approve' && action !== 'reject') {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }

            if (action === 'approve') {
                const theater = await this.theaterRepository.approveTheater(theaterId)
                if (theater) return get200Response(theater)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            } else {
                const theater = await this.theaterRepository.rejectTheater(theaterId)
                if (theater) return get200Response(theater)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateTheaterProfilePic (theaterId: ID, fileName: string | undefined): Promise<IApiTheaterRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(theaterId, fileName, 'theaterId, filename from use case')
            const theater = await this.theaterRepository.findById(theaterId)
            // Deleting theater dp if it already exist
            if (theater && theater.profilePic) {
                const filePath = path.join(__dirname, `../../images/${theater.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedTheater = await this.theaterRepository.updateTheaterProfilePic(theaterId, fileName)
            if (updatedTheater) return get200Response(updatedTheater)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async removeTheaterProfilePic (theaterId: ID): Promise<IApiTheaterRes> {
        try {
            const user = await this.theaterRepository.findById(theaterId)
            if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            // Deleting user dp if it already exist
            if (user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedTheater = await this.theaterRepository.removeTheaterProfilePic(theaterId)
            if (updatedTheater) {
                return get200Response(updatedTheater) 
            }
            
            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async addToWallet (theaterId: ID, amount: number): Promise<IApiTheaterRes> {
        try {
            if (typeof amount !== 'number') return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number')
            const user = await this.theaterRepository.updateWallet(theaterId, amount, 'Added To Wallet')

            if (user !== null) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)

        } catch (error) {
            return get500Response(error as Error)
        }
    }

}