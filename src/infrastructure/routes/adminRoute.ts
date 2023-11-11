import express from "express";
import { AdminController } from "../../adapters/controllers/adminController";
import { Encrypt } from "../../providers/bcryptPassword";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { JWTToken } from "../../providers/jwtToken";
import { AdminRepository } from "../repositories/adminRepository";
const adminRouter = express.Router()

const encrypt = new Encrypt()

const adminRepository = new AdminRepository()
const jwtToken = new JWTToken()
const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)

const aController = new AdminController(adminUseCase)

adminRouter.post('/login', (req, res) => aController.adminLogin(req, res))


export default adminRouter