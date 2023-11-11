import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { ITheater } from "../interfaces/schema/theaterRepo";
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

    async verifyLogin(email: string, password: string){
        const theaterData = await this.theaterRepository.findByEmail(email)
        if(theaterData !== null) {

            if(theaterData.isBlocked){
                return {
                    status : 400,
                    data: {
                        messsage: 'You have been blocked by admin',
                        token: ''
                    }
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if(passwordMatch){
                const token = this.jwtToken.generateToken(theaterData._id)
                return {
                    status: 200,
                    data: { theaterData, token }
                }
            }else{
                return {
                    status: 400,
                    data : {
                        message: 'Incorrect Password',
                        token: ''
                    }
                }
            }
        }else{
            return {
                status: 400,
                data: {
                    message: 'Invalid Email',
                    token: ''
                }
            }
        }
    }



}