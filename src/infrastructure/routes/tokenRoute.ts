import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { STATUS_CODES } from "../../constants/httpStausCodes";
import { JWTToken } from "../../providers/jwtToken";

const tokenRouter = express.Router()

const jwtToken = new JWTToken()

tokenRouter.get('/', (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers.authorization;
        // console.log(refreshToken, 'refresh token in tokenRouer');
        
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
            const accessToken = jwtToken.generateAccessToken(decoded.id)
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