import express from "express";
import { AdminController } from "../../adapters/controllers/adminController";
import { Encrypt } from "../../providers/bcryptPassword";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { JWTToken } from "../../providers/jwtToken";
import { AdminRepository } from "../repositories/adminRepository";
import { MovieRepository } from "../repositories/movieRepository";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { MovieController } from "../../adapters/controllers/movieController";
import { UserUseCase } from "../../useCases/userUseCase";
import { UserRepository } from "../repositories/userRepository";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { TheaterRepository } from "../repositories/theaterRepository";
import { adminAuth } from "../middleware/adminAuth";
import { TempUserRepository } from "../repositories/tempUserRepository";
import { MailSender } from "../../providers/nodemailer";
const adminRouter = express.Router()

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailSender = new MailSender()

const adminRepository = new AdminRepository()
const userRepository = new UserRepository()
const theaterRepository = new TheaterRepository()
const movieRepository = new MovieRepository()
const tempUserRepository = new TempUserRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken,  mailSender)
const theateUseCase = new TheaterUseCase(theaterRepository, encrypt, jwtToken)
const movieUseCase = new MovieUseCase(movieRepository)

const aController = new AdminController(adminUseCase, userUseCase, theateUseCase)
const mController =  new MovieController(movieUseCase)


adminRouter.post('/login',  (req, res) => aController.adminLogin(req, res))
adminRouter.get('/movies', adminAuth, (req, res) => mController.getMovies(req,res))
adminRouter.post('/movies/add', adminAuth, (req, res) => mController.addMovie(req,res))
adminRouter.patch('/movies/delete/:movieId', adminAuth, (req, res) => mController.deleteMovie(req, res))
adminRouter.get('/users', adminAuth, (req, res) => aController.getAllUsers(req,res))
adminRouter.patch('/users/block/:userId', adminAuth, (req, res) => aController.blockUser(req,res))
adminRouter.get('/theaters', adminAuth, (req, res) => aController.getAllTheaters(req,res))
adminRouter.patch('/theaters/block/:theaterId', adminAuth,  (req, res) => aController.blockTheater(req,res))


export default adminRouter