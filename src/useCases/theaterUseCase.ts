// import { AuthRes } from "../Types/AuthRes";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { ID } from "../interfaces/common";
import { IApiTheaterRes, IApiTheatersRes, ITheater, ITheaterUpdate } from "../interfaces/schema/theaterSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";



export class TheaterUseCase {
    constructor (
        private theaterRepository: TheaterRepository,
        private encrypt : Encrypt,
        private jwtToken : JWTToken
    ){}

    async saveTheater (theaterData: ITheater):Promise<ITheater> {
        return await this.theaterRepository.saveTheater(theaterData)
    }

    async isEmailExist (email:string):Promise<boolean> {
        const isUserExist = await this.theaterRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async verifyLogin(email: string, password: string): Promise<IApiTheaterRes>{
        const theaterData = await this.theaterRepository.findByEmail(email)
        if(theaterData !== null) {

            if(theaterData.isBlocked){
                return {
                    status : STATUS_CODES.FORBIDDEN,
                    message: 'You have been blocked by admin',
                    data: null,
                    token: ''
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if(passwordMatch){
                const token = this.jwtToken.generateToken(theaterData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: theaterData, 
                    token,
                }
            }else{
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Incorrect Password',
                    data : null,
                    token: ''
                }
            }
        }else{
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email',
                token: '',
                data: null
            }
        }
    }

    async getAllTheaters (): Promise<IApiTheatersRes> {
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

    async blockTheater (theaterId: string) {
        return await this.theaterRepository.blockTheater(theaterId)
    }

    async getNearestTheaters(lon:number, lat:number, radius:number){
        return await this.theaterRepository.getNearestTheaters(lon, lat, radius)
    }

    async getNearestTheatersByLimit (lon:number, lat:number, limit:number, maxDistance: number) {
        return await this.theaterRepository.getNearestTheatersByLimit(lon, lat, limit, maxDistance)
    }

    async updateTheater (theaterId: ID, theater: ITheaterUpdate): Promise<IApiTheaterRes> {
        try {
            const theaterData = await this.theaterRepository.updateTheater(theaterId, theater)
            if (theaterData !== null ) {
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

}