import { log } from "console";
import { OTP_TIMER } from "../infrastructure/constants/constants";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { IApiAuthRes, IApiRes, IApiTempAuthRes, IWalletHistoryAndCount } from "../interfaces/common";
import { IApiTempTheaterRes, ITempTheaterReq, ITempTheaterRes } from "../interfaces/schema/tempTheaterSchema";
import { IApiTheaterAuthRes, IApiTheaterRes, ITheaterUpdate, ITheatersAndCount } from "../interfaces/schema/theaterSchema";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";
import fs from 'fs'
import { IRevenueData } from "../interfaces/chart";
import { calculateTheaterShare } from "../infrastructure/helperFunctions/calculateTheaterShare";
import { getDateKeyWithInterval } from "../infrastructure/helperFunctions/dashboardHelpers";
import { IEncryptor } from "./utils/encryptor";
import { ITokenGenerator } from "./utils/tokenGenerator";
import { IMailSender } from "./utils/mailSender";
import { IOTPGenerator } from "./utils/otpGenerator";
import { ITheaterRepo } from "./repos/theaterRepo";
import { ITempTheaterRepo } from "./repos/tempTheaterRepo";
import { ITicketRepo } from "./repos/ticketRepo";


export class TheaterUseCase {
    constructor(
        private readonly _theaterRepository: ITheaterRepo,
        private readonly _tempTheaterRepository: ITempTheaterRepo,
        private readonly _ticketRepository: ITicketRepo,
        private readonly _encryptor: IEncryptor,
        private readonly _tokenGenerator: ITokenGenerator,
        private readonly _mailer: IMailSender,
        private readonly _otpGenerator: IOTPGenerator
    ) { }

    async verifyAndSaveTemporarily(theaterData: ITempTheaterReq): Promise<IApiTempAuthRes<ITempTheaterRes>> {
        try {
            const isEmailExist = await this.isEmailExist(theaterData.email);
            if (isEmailExist) {
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Email Already Exist')
            } else {
                theaterData.otp = this._otpGenerator.generateOTP()
                theaterData.password = await this._encryptor.encryptPassword(theaterData.password)

                const tempTheater = await this._tempTheaterRepository.saveTheater(theaterData)
                this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp)
                const userAuthToken = this._tokenGenerator.generateTempToken(tempTheater._id)

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

    // To send an otp to mail,and delete after spcified time (OTP_TIMER)
    sendTimeoutOTP(id: string, email: string, OTP: number) {
        console.log(OTP, 'otp from sendTimeoutOTP');
        this._mailer.sendOTP(email, OTP)

        setTimeout(async () => {
            await this._tempTheaterRepository.unsetTheaterOTP(id, email)
        }, OTP_TIMER)
    }

    async verifyAndSendNewOTP(authToken: string | undefined): Promise<IApiTempTheaterRes> {
        try {
            if (authToken) {
                const decoded = jwt.verify(authToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload
                const tempTheater = await this._tempTheaterRepository.findTempTheaterById(decoded.id)
                if (tempTheater) {
                    const newOTP = this._otpGenerator.generateOTP()
                    await this._tempTheaterRepository.updateTheaterOTP(tempTheater._id, tempTheater.email, newOTP)
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
                const theater = await this._tempTheaterRepository.findTempTheaterById(decoded.id)
                if (theater) {
                    if (otp == theater.otp) {
                        const savedTheater = await this._theaterRepository.saveTheater(theater)
                        const accessToken = this._tokenGenerator.generateAccessToken(savedTheater._id)
                        const refreshToken = this._tokenGenerator.generateRefreshToken(savedTheater._id)
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
    //     return await this._theaterRepository.saveTheater(theaterData)
    // }

    async isEmailExist(email: string): Promise<boolean> {
        const isUserExist = await this._theaterRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async verifyLogin(email: string, password: string): Promise<IApiTheaterAuthRes> {
        const theaterData = await this._theaterRepository.findByEmail(email)
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

            const passwordMatch = await this._encryptor.comparePasswords(password, theaterData.password)
            if (passwordMatch) {
                const accessToken = this._tokenGenerator.generateAccessToken(theaterData._id)
                const refreshToken = this._tokenGenerator.generateRefreshToken(theaterData._id)
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

    // To get all theaters
    async getAllTheaters(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<ITheatersAndCount | null>> {
        try {
            if (isNaN(page)) page = 1
            if (isNaN(limit)) limit = 10
            if (!searchQuery) searchQuery = ''
            const theaters = await this._theaterRepository.findAllTheaters(page, limit, searchQuery)
            const theaterCount = await this._theaterRepository.findTheaterCount(searchQuery)
            return get200Response({ theaters, theaterCount })
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To Block Theater
    async blockTheater(theaterId: string) {
        try {
            await this._theaterRepository.blockTheater(theaterId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // Returns Every theaters within a radius
    async getNearestTheaters(lon: number, lat: number, radius: number) {
        return await this._theaterRepository.getNearestTheaters(lon, lat, radius)
    }

    // Returns theaters within radius maxDistance, and limit count
    async getNearestTheatersByLimit(lon: number, lat: number, limit: number, maxDistance: number) {
        return await this._theaterRepository.getNearestTheatersByLimit(lon, lat, limit, maxDistance)
    }

    // To update theater data, from theater profile
    async updateTheater(theaterId: string, theater: ITheaterUpdate): Promise<IApiTheaterRes> {
        try {
            const theaterData = await this._theaterRepository.updateTheater(theaterId, theater)
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
    async getTheaterData(theaterId: string): Promise<IApiTheaterRes> {
        try {
            if (theaterId === undefined) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            const theater = await this._theaterRepository.findById(theaterId)
            if (theater === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            return get200Response(theater)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To approve or reject theater for admin when they register
    async theaterApproval(theaterId: string, action: string | undefined): Promise<IApiTheaterRes> {
        try {
            if (action !== 'approve' && action !== 'reject') {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }

            if (action === 'approve') {
                const theater = await this._theaterRepository.approveTheater(theaterId)
                if (theater) return get200Response(theater)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            } else {
                const theater = await this._theaterRepository.rejectTheater(theaterId)
                if (theater) return get200Response(theater)
                else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To update theater profile pic
    async updateTheaterProfilePic (theaterId: string, fileName: string | undefined): Promise<IApiTheaterRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(theaterId, fileName, 'theaterId, filename from use case')
            const theater = await this._theaterRepository.findById(theaterId)
            // Deleting theater dp if it already exist
            if (theater && theater.profilePic) {
                const filePath = path.join(__dirname, `../../images/${theater.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedTheater = await this._theaterRepository.updateTheaterProfilePic(theaterId, fileName)
            if (updatedTheater) return get200Response(updatedTheater)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To delete Theater Profile
    async removeTheaterProfilePic (theaterId: string): Promise<IApiTheaterRes> {
        try {
            const user = await this._theaterRepository.findById(theaterId)
            if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
            // Deleting user dp if it already exist
            if (user.profilePic) {
                const filePath = path.join(__dirname, `../../images/${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedTheater = await this._theaterRepository.removeTheaterProfilePic(theaterId)
            if (updatedTheater) {
                return get200Response(updatedTheater) 
            }
            
            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To add money to wallet
    async addToWallet (theaterId: string, amount: number): Promise<IApiTheaterRes> {
        try {
            if (typeof amount !== 'number') return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Amount recieved is not a number')
            const user = await this._theaterRepository.updateWallet(theaterId, amount, 'Added To Wallet')

            if (user !== null) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To get wallet history of a theater
    async getWalletHistory (theaterId: string, page: number, limit: number): Promise<IApiRes<IWalletHistoryAndCount | null>> {
        try {
            const userWallet = await this._theaterRepository.getWalletHistory(theaterId, page, limit)
            if (userWallet) return get200Response(userWallet)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid theaterId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To get revenue data, to show graph
    async getRevenueData (theaterId: string, startDate?: Date, endDate?: Date): Promise<IApiRes<IRevenueData | null>> {
        try {
            if (startDate === undefined || endDate === undefined) {
                startDate = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 1, // Go back one month
                  new Date().getDate() // Keep the same day of the month
                );
                endDate = new Date();
            }
            
            const ticketsOfTheater = await this._ticketRepository.getTicketsOfTheaterByTime(theaterId, startDate, endDate)
            log(ticketsOfTheater, 'tickets to handle in get revenue use case')
            const addedAmt: Record<string, number> = {}
            ticketsOfTheater.forEach(tkt => {
                const dateKey = getDateKeyWithInterval(startDate as Date, endDate as Date, tkt.startTime)
                if (!addedAmt[dateKey]) {
                    addedAmt[dateKey] = 0;
                  }
                  addedAmt[dateKey] += calculateTheaterShare(tkt)
            });

            const labels = Object.keys(addedAmt)
            const data = Object.values(addedAmt)
            return get200Response({ labels, data })
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}