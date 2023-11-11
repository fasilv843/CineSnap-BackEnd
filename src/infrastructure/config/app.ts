import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import adminRouter from '../routes/adminRoute'
import theatreRouter from '../routes/theatreRoute'
import userRouter from '../routes/userRoute'

export const createServer = () => {
    try {
        const app = express()

        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        // app.use(express.static(path.join(__dirname,'../public')))
        app.use(cookieParser())

        app.use(cors({
            credentials: true,
            origin: process.env.CORS_URI
        }))

        app.use('/api/admin', adminRouter)
        app.use('/api/theater', theatreRouter)
        app.use('/api/user', userRouter)

        return app

    } catch (error) {
        const err : Error = error as Error
        console.log(err.message);
    }
}