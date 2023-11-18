import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository()

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if(token) {
            const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET_KEY as string ) as JwtPayload
            const userData = await userRepository.findById(decoded.userId as string)
            if(userData !== null){
                // req.userId = userData?._id
                if(userData.isBlocked){
                    res.status(401).json({message: 'You are blocked'})
                }else{
                    next()
                }
            }else{
                res.status(401).json({message: 'Not authorized, invalid token'})
            }
        }else{
            res.status(401).json({message: 'Token not available'})
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({message: 'Not authorized, invalid token'})
    }
}