import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { TokenGenerator } from "../utils/jwtToken";

const tokenRouter = express.Router()

const tokenGenerator = new TokenGenerator()

tokenRouter.get('/', (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers.authorization;
        
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
            const accessToken = tokenGenerator.generateAccessToken(decoded.id)
            res.status(STATUS_CODES.OK).json({
                status: STATUS_CODES.OK,
                message: 'Success',
                accessToken
            })
        } else {
            res.status(STATUS_CODES.UNAUTHORIZED).json({
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized',
                accessToken: ''
            })
        }
    } catch (error) {
        console.log(error, 'error during generating access token');
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: (error as Error).message,
            accessToken: ''
        })
    }
})

export default tokenRouter