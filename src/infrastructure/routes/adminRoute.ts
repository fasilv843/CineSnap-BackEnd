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
// import { adminAuth } from "../middleware/adminAuth";
const adminRouter = express.Router()

const encrypt = new Encrypt()
const jwtToken = new JWTToken()

const adminRepository = new AdminRepository()
const userRepository = new UserRepository()
const theaterRepository = new TheaterRepository()
const movieRepository = new MovieRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository ,encrypt, jwtToken)
const theateUseCase = new TheaterUseCase(theaterRepository, encrypt, jwtToken)
const movieUseCase = new MovieUseCase(movieRepository)

const aController = new AdminController(adminUseCase, userUseCase, theateUseCase)
const mController =  new MovieController(movieUseCase)


adminRouter.post('/login', (req, res) => aController.adminLogin(req, res))
adminRouter.get('/movies', (req, res) => mController.loadMovies(req,res))
adminRouter.post('/movies/add', (req, res) => mController.addMovie(req,res))
adminRouter.get('/users',  (req, res) => aController.getAllUsers(req,res))
adminRouter.patch('/users/block/:userId',  (req, res) => aController.blockUser(req,res))
adminRouter.get('/theaters', (req, res) => aController.getAllTheaters(req,res))
adminRouter.patch('/theaters/block/:theaterId',  (req, res) => aController.blockTheater(req,res))


export default adminRouter