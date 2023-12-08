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
import { TempTheaterRepository } from "../repositories/tempTheaterRepository";
import { theaterAuth } from "../middleware/theaterAuth";
import { ShowController } from "../../adapters/controllers/showController";
import { ShowUseCase } from "../../useCases/showUseCase";
import { ShowRepository } from "../repositories/showRepository";

// thr = theater
const thrRouter = express.Router()

const thrRepository = new TheaterRepository()
const scnRepositoty = new ScreenRepository()
const tempThrRepository = new TempTheaterRepository()
const showRepository = new ShowRepository()

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailer = new MailSender()
const otpGenerator = new GenerateOtp()

const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailer, otpGenerator)
const scnUseCase = new ScreenUseCase(scnRepositoty)
const showUseCase = new ShowUseCase(showRepository)

const tController = new TheaterController(thrUseCase)
const scnController = new ScreenController(scnUseCase)
const showController = new ShowController(showUseCase)

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))
thrRouter.get('/resendOtp', (req, res) => tController.resendOTP(req, res))

thrRouter.put('/update/:theaterId', theaterAuth, (req, res) => tController.updateTheaterData(req, res))

thrRouter.get('/screens/:theaterId', theaterAuth, (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', theaterAuth, (req, res) => scnController.saveScreen(req, res))
thrRouter.get('/screens/get/:screenId', theaterAuth, (req, res) => scnController.findScreenById(req, res))
thrRouter.put('/screens/edit/:screenId', theaterAuth, (req, res) => scnController.editScreen(req, res))
thrRouter.delete('/screens/delete/:screenId', theaterAuth, (req, res) => scnController.deleteScreen(req, res))

thrRouter.get('/shows/:theaterId', (req, res) => showController.findShowsOnTheater(req, res))
thrRouter.post('/show/add', (req, res) => showController.addShow(req, res))


export default thrRouter