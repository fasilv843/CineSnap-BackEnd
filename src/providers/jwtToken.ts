import jwt from 'jsonwebtoken'
import { JWT } from "../interfaces/jwt";
import { ID } from '../interfaces/common';


export class JWTToken implements JWT{
    generateToken(id: ID): string {
        const KEY = process.env.JWT_SECRET_KEY
        if(KEY !== undefined){
            return jwt.sign({id}, KEY)
        }
        throw new Error('JWT Key is not defined')
    }
}