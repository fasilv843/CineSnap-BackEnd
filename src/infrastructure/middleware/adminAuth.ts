import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminRepository } from "../repositories/adminRepository";


const adminRepository = new AdminRepository()

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if(token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string ) as JwtPayload
            const adminData = await adminRepository.findById(decoded.userId as string)
            if(adminData !== null){
                next()
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