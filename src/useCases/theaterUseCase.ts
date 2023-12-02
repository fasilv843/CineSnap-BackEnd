import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { TempTheaterRepository } from "../infrastructure/repositories/tempTheaterRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { ID } from "../interfaces/common";
import { IApiTempTheaterRes, ITempTheaterReq } from "../interfaces/schema/tempTheaterSchema";
import { IApiTheaterRes, IApiTheatersRes, ITheaterUpdate } from "../interfaces/schema/theaterSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";
import { GenerateOtp } from "../providers/otpGenerator";
import jwt, { JwtPayload } from "jsonwebtoken";


export class TheaterUseCase {
    constructor(
        private theaterRepository: TheaterRepository,
        private tempTheaterRepository: TempTheaterRepository,
        private encrypt: Encrypt,
        private jwtToken: JWTToken,
        private mailer: MailSender,
        private otpGenerator: GenerateOtp,
    ) { }

    async verifyAndSaveTemporarily(theaterData: ITempTheaterReq): Promise<IApiTempTheaterRes> {
        try {
            const isEmailExist = await this.isEmailExist(theaterData.email);
            if (isEmailExist) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'Email Already Exist',
                    data: null,
                    token: ''
                }
            } else {
                theaterData.otp = this.otpGenerator.generateOTP()
                theaterData.password = await this.encrypt.encryptPassword(theaterData.password)

                const tempTheater = await this.tempTheaterRepository.saveTheater(theaterData)
                this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp)
                const userAuthToken = this.jwtToken.generateToken(tempTheater._id)

                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: tempTheater,
                    token: userAuthToken
                }
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }

    sendTimeoutOTP(id: ID, email: string, OTP: number) {
        console.log(OTP, 'otp from sendTimoutOTP');
        this.mailer.sendMail(email, OTP)

        setTimeout(async () => {
            await this.tempTheaterRepository.unsetTheaterOTP(id, email)
        }, OTP_TIMER)
    }

    async validateAndSaveTheater (authToken: string | undefined, otp: number): Promise<IApiTheaterRes> {
        try {
            if(authToken) {
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const theater = await this.tempTheaterRepository.findTempTheaterById(decoded.id)
                if(theater) {
                    if(otp == theater.otp) {
                        const savedTheater = await this.theaterRepository.saveTheater(theater)
                        const token = this.jwtToken.generateToken(savedTheater._id)
                        return {
                            status: STATUS_CODES.OK,
                            message: 'Success',
                            data: savedTheater,
                            token
                        }
                    } else {
                        return {
                            status: STATUS_CODES.UNAUTHORIZED,
                            message: 'Incorrect OTP',
                            data: null,
                            token: ''
                        }
                    }
                } else {
                    return {
                        status: STATUS_CODES.UNAUTHORIZED,
                        message: 'Unautherized',
                        data: null,
                        token: ''
                    }
                }

            } else {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Token is Missing',
                    data: null,
                    token: ''
                }
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }

    // async saveTheater(theaterData: ITheater): Promise<ITheater> {
    //     return await this.theaterRepository.saveTheater(theaterData)
    // }

    async isEmailExist(email: string): Promise<boolean> {
        const isUserExist = await this.theaterRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async verifyLogin(email: string, password: string): Promise<IApiTheaterRes> {
        const theaterData = await this.theaterRepository.findByEmail(email)
        if (theaterData !== null) {

            if (theaterData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You have been blocked by admin',
                    data: null,
                    token: ''
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if (passwordMatch) {
                const token = this.jwtToken.generateToken(theaterData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: theaterData,
                    token,
                }
            } else {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Incorrect Password',
                    data: null,
                    token: ''
                }
            }
        } else {
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email',
                token: '',
                data: null
            }
        }
    }

    async getAllTheaters(): Promise<IApiTheatersRes> {
        try {
            const theaters = await this.theaterRepository.findAllTheaters()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: theaters,
                token: ''
            }
        } catch (error) {
            console.log(error);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
                data: [],
                token: ''
            }
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

    async updateTheater(theaterId: ID, theater: ITheaterUpdate): Promise<IApiTheaterRes> {
        try {
            const theaterData = await this.theaterRepository.updateTheater(theaterId, theater)
            if (theaterData !== null) {
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: theaterData,
                    token: ''
                }
            } else {
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Bad Request, theaterId is not availble',
                    data: null,
                    token: ''
                }
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }

    async getTheaterData(theaterId: ID): Promise<IApiTheaterRes> {
        try {
            const theater = await this.theaterRepository.findById(theaterId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: theater,
                token: ''
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null,
                token: ''
            }
        }
    }

}