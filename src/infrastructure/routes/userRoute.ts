import express from "express";
import { UserController } from "../../adapters/controllers/userController";
import { UserUseCase } from "../../useCases/userUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { UserRepository } from "../repositories/userRepository";
import { Encrypt } from "../../providers/bcryptPassword";
import { JWTToken } from "../../providers/jwtToken"; 

const userRouter = express.Router()

const userRepository = new UserRepository()
const encrypt = new Encrypt()
const jwtToken = new JWTToken()

const userUseCase = new UserUseCase(userRepository, encrypt, jwtToken)
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const uController = new UserController(userUseCase, mailSender, otpGenerator, encrypt )

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.post('/resendOtp', uController.resendOTP)
userRouter.post('/login', uController.userLogin)
userRouter.post('/logout', uController.logout)


export default userRouter
