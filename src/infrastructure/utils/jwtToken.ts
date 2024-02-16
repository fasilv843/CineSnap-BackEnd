import jwt from 'jsonwebtoken'
import { JWT } from "../../interfaces/jwt";
import { accessTokenExp, refreshTokenExp, tempTokenExp } from '../constants/constants';



export class JWTToken implements JWT{

    generateAccessToken(id: string): string {
        const KEY = process.env.JWT_SECRET_KEY
        if(KEY !== undefined){
            const exp = Math.floor(Date.now() / 1000) + accessTokenExp;
            return jwt.sign({id, exp, iat: Date.now()/1000 }, KEY)
        }
        throw new Error('JWT Key is not defined')
    }

    generateRefreshToken(id: string): string {
        const KEY = process.env.JWT_SECRET_KEY
        if(KEY !== undefined){
            const exp = Math.floor(Date.now() / 1000) + refreshTokenExp;
            return jwt.sign({id, exp, iat: Date.now()/1000 }, KEY)
        }
        throw new Error('JWT Key is not defined')
    }

    // To generate a temporary token for authentication, for those who don't verified email
    // id will be temp database _id
    generateTempToken(id: string): string {
        const KEY = process.env.JWT_SECRET_KEY
        if(KEY !== undefined){
            const exp = Math.floor(Date.now() / 1000) + tempTokenExp;
            return jwt.sign({id, exp, iat: Date.now()/1000 }, KEY)
        }
        throw new Error('JWT Key is not defined')
    }
}