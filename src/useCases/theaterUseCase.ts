import { AuthRes } from "../Types/AuthRes";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { ITheater } from "../interfaces/schema/theaterSchema";
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

    async verifyLogin(email: string, password: string): Promise<AuthRes>{
        const theaterData = await this.theaterRepository.findByEmail(email)
        if(theaterData !== null) {

            if(theaterData.isBlocked){
                return {
                    status : 400,
                    message: 'You have been blocked by admin',
                    data: null,
                    token: ''
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if(passwordMatch){
                const token = this.jwtToken.generateToken(theaterData._id)
                return {
                    status: 200,
                    message: 'Success',
                    data: theaterData, 
                    token,
                }
            }else{
                return {
                    status: 400,
                    message: 'Incorrect Password',
                    data : null,
                    token: ''
                }
            }
        }else{
            return {
                status: 400,
                message: 'Invalid Email',
                token: '',
                data: null
            }
        }
    }



}