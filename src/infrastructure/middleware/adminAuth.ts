import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminRepository } from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";


const adminRepository = new AdminRepository()
const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = STATUS_CODES

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      if (token) {
  
        try {
          const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
          
          const adminData = await adminRepository.findById(decoded.id);
  
          if (adminData !== null) {
            next();
          } else {
            res.status(UNAUTHORIZED).json({ message: 'Not authorized, invalid token' });
          }
        } catch (verifyError) {
          console.error('JWT Verification Error:', verifyError);
          res.status(UNAUTHORIZED).json({ message: 'Not authorized, invalid token' });
        }
      } else {
        res.status(UNAUTHORIZED).json({ message: 'Token not available' });
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
};
  