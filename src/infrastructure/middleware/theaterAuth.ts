import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TheaterRepository } from "../repositories/theaterRepository"

const thrRepository = new TheaterRepository()

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if(token) {
            const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET_KEY as string ) as JwtPayload
            const theaterData = await thrRepository.findById(decoded.theaterId as string)
            if(theaterData !== null){
                // req.theaterId = theaterData?._id
                if(theaterData.isBlocked){
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