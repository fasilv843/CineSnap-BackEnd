import express from "express";
import { UserController } from "../../adapters/controllers/userController";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { UserRepository } from "../repositories/userRepository";
import { Encrypt } from "../../providers/bcryptPassword";
import { JWTToken } from "../../providers/jwtToken"; 
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { TheaterController } from "../../adapters/controllers/theaterController";
import { TheaterRepository } from "../repositories/theaterRepository";

const userRouter = express.Router()

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailer = new MailSender()
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const userRepository = new UserRepository()
const thrRepository = new TheaterRepository()

const userUseCase = new UserUseCase(userRepository, encrypt, jwtToken)
const thrUseCase = new TheaterUseCase(thrRepository, encrypt, jwtToken)

const uController = new UserController(userUseCase, mailSender, otpGenerator, encrypt )
const tController = new TheaterController(thrUseCase, mailer, otpGenerator, encrypt)


userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.post('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))
userRouter.post('/logout', (req,res) => uController.logout(req,res))

userRouter.get('/theaters', (req,res) => tController.loadTheaters(req,res))


export default userRouter
