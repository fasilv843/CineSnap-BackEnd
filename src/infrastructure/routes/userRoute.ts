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
import { MovieController } from "../../adapters/controllers/movieController";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { MovieRepository } from "../repositories/movieRepository";
import { TempUserRepository } from "../repositories/tempUserRepository";

const userRouter = express.Router()

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailer = new MailSender()
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const userRepository = new UserRepository()
const thrRepository = new TheaterRepository()
const movieRepository = new MovieRepository()
const tempUserRepository = new TempUserRepository()

const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken,  mailSender)
const thrUseCase = new TheaterUseCase(thrRepository, encrypt, jwtToken)
const movieUseCase = new MovieUseCase(movieRepository)

const uController = new UserController(userUseCase, otpGenerator, encrypt )
const tController = new TheaterController(thrUseCase, mailer, otpGenerator, encrypt)
const mController = new MovieController(movieUseCase)


userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/auth/google', (req, res) => uController.userSocialSignUp(req, res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.get('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))
userRouter.post('/logout', (req,res) => uController.logout(req,res))

userRouter.put('/update/:userId', (req,res) => uController.updateProfile(req,res))

userRouter.get('/get/:userId',  (req,res) => uController.getUserData(req,res))
userRouter.get('/theaters', (req,res) => tController.loadTheaters(req,res))
userRouter.get('/theater/:theaterId', (req,res) => tController.getTheaterData(req,res))
userRouter.get('/movies', (req, res) => mController.getAvailableMovies(req, res))

userRouter.get('/banner', (req, res) => mController.getBannerMovies(req, res))

export default userRouter
