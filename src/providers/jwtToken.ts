import jwt from 'jsonwebtoken'
import { JWT } from "../interfaces/jwt";


export class JWTToken implements JWT{
    generateToken(userId: string): string {
        const KEY = process.env.JWT_SECRET_KEY
        if(KEY !== undefined){
            return jwt.sign({userId}, KEY)
        }
        throw new Error('JWT Key is not defined')
    }

    
}