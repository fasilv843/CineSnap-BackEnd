import express from "express";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { TheaterController } from "../../adapters/controllers/theaterController";
import { TheaterRepository } from "../repositories/theaterRepository";
import { JWTToken } from "../../providers/jwtToken";

// thr = theater
const thrRouter = express.Router()

const thrRepository = new TheaterRepository()
const encrypt = new Encrypt()
const jwtToken = new JWTToken()

const thrUseCase = new TheaterUseCase(thrRepository, encrypt, jwtToken)
const mailer = new MailSender()
const otpGenerator = new GenerateOtp()

const tController = new TheaterController(thrUseCase, mailer, otpGenerator, encrypt)

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))

export default thrRouter