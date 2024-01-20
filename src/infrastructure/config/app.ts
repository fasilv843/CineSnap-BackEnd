import express from 'express'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import cors from 'cors'
import adminRouter from '../routes/adminRoute'
import theatreRouter from '../routes/theatreRoute'
import userRouter from '../routes/userRoute'
import tokenRouter from '../routes/tokenRoute'
import path from 'path'
import { log } from 'console';

export const createServer = () => {
    try {
        const app = express()

        log(process.env.CORS_URI, 'cors url from .env.NODE_ENV')

        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        app.use('/images', express.static(path.join(__dirname, '../../../images')));
        app.use(cookieParser())

        app.use(cors({
            credentials: true,
            origin: process.env.CORS_URI
        }))

        app.use('/api/admin', adminRouter)
        app.use('/api/theater', theatreRouter)
        app.use('/api/user', userRouter)
        app.use('/api/token', tokenRouter)
        return app

    } catch (error) {
        console.log('error logging from createServer, from app.ts');
        console.error('error caught from app')
        console.log((error as Error).message);
    }
}