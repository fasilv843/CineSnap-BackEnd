import express from "express";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { MailSender } from "../../providers/nodemailer";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { TheaterController } from "../../adapters/controllers/theaterController";
import { TheaterRepository } from "../repositories/theaterRepository";
import { JWTToken } from "../../providers/jwtToken";
import { ScreenController } from "../../adapters/controllers/screenController";
import { ScreenUseCase } from "../../useCases/screenUseCase";
import { ScreenRepository } from "../repositories/screenRepository";

// thr = theater
const thrRouter = express.Router()

const thrRepository = new TheaterRepository()
const scnRepositoty = new ScreenRepository()
const encrypt = new Encrypt()
const jwtToken = new JWTToken()

const thrUseCase = new TheaterUseCase(thrRepository, encrypt, jwtToken)
const scnUseCase = new ScreenUseCase(scnRepositoty)
const mailer = new MailSender()
const otpGenerator = new GenerateOtp()

const tController = new TheaterController(thrUseCase, mailer, otpGenerator, encrypt)
const scnController = new ScreenController(scnUseCase)

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))

thrRouter.put('/update/:theaterId', (req, res) => tController.updateTheaterData(req, res))

thrRouter.get('/screens/:theaterId', (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', (req, res) => scnController.saveScreen(req, res))
thrRouter.get('/screens/get/:screenId', (req, res) => scnController.findScreenById(req, res))
thrRouter.put('/screens/edit/:screenId', (req, res) => scnController.editScreen(req, res))
thrRouter.delete('/screens/delete/:screenId', (req, res) => scnController.deleteScreen(req, res))

export default thrRouter