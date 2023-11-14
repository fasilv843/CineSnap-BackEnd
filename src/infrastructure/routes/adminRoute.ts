import express from "express";
import { AdminController } from "../../adapters/controllers/adminController";
import { Encrypt } from "../../providers/bcryptPassword";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { JWTToken } from "../../providers/jwtToken";
import { AdminRepository } from "../repositories/adminRepository";
import { MovieRepository } from "../repositories/movieRepository";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { MovieController } from "../../adapters/controllers/movieController";
import { adminAuth } from "../middleware/adminAuth";
const adminRouter = express.Router()

const encrypt = new Encrypt()

const adminRepository = new AdminRepository()
const jwtToken = new JWTToken()
const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)

const aController = new AdminController(adminUseCase)

const movieRepository = new MovieRepository()
const movieUseCase = new MovieUseCase(movieRepository)
const mController =  new MovieController(movieUseCase)

adminRouter.post('/login', (req, res) => aController.adminLogin(req, res))
adminRouter.get('/movies', adminAuth, (req, res) => mController.loadMovies(req,res))
adminRouter.post('/movies/add', adminAuth, (req, res) => mController.addMovie(req,res))


export default adminRouter