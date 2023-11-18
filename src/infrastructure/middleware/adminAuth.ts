import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminRepository } from "../repositories/adminRepository";


const adminRepository = new AdminRepository()

// export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.headers.authorization
//         console.log(token, 'token');
        
//         if(token) {
//             console.log(process.env.JWT_SECRET_KEY, 'jwt key');
            
//             const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string ) as JwtPayload
//             console.log('decoded ..................');
            
//             const adminData = await adminRepository.findById(decoded.id as string)
//             if(adminData !== null){
//                 next()
//             }else{
//                 res.status(401).json({message: 'Not authorized, invalid token'})
//             }
//         }else{
//             res.status(401).json({message: 'Token not available'})
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(401).json({message: 'Not authorized, invalid token'})
//     } 
// }


export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      if (token) {
        
        console.log(token.slice(7), 'token');
        console.log(process.env.JWT_SECRET_KEY, 'jwt key');
  
        try {
          const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET_KEY as string) as JwtPayload;
          console.log('decoded:', decoded); 
          
          const adminData = await adminRepository.findById(decoded.id as string);
  
          if (adminData !== null) {
            next();
          } else {
            res.status(401).json({ message: 'Not authorized, invalid token' });
          }
        } catch (verifyError) {
          console.error('JWT Verification Error:', verifyError);
          res.status(401).json({ message: 'Not authorized, invalid token' });
        }
      } else {
        res.status(401).json({ message: 'Token not available' });
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  