import express from "express";
import { adminAuth } from "../middleware/adminAuth";
import { aController, mController, ticketController } from "../utils/controllers";
const adminRouter = express.Router()

adminRouter.post('/login',  (req, res) => aController.adminLogin(req, res))

adminRouter.get('/dashboard/revenue', adminAuth, (req, res) => aController.getRevenueData(req, res))
adminRouter.get('/movies', adminAuth, (req, res) => mController.getMovies(req,res))
adminRouter.post('/movies/add', adminAuth, (req, res) => mController.addMovie(req,res))
adminRouter.patch('/movies/delete/:movieId', adminAuth, (req, res) => mController.deleteMovie(req, res))
adminRouter.get('/users', adminAuth, (req, res) => aController.getAllUsers(req,res))
adminRouter.patch('/users/block/:userId', adminAuth, (req, res) => aController.blockUser(req,res))
adminRouter.get('/theaters', adminAuth, (req, res) => aController.getAllTheaters(req,res))
adminRouter.patch('/theaters/block/:theaterId', adminAuth,  (req, res) => aController.blockTheater(req,res))
adminRouter.patch('/theaters/approval/:theaterId', adminAuth,  (req, res) => aController.theaterApproval(req,res))
adminRouter.get('/csmovies/get', adminAuth,  (req, res) => mController.getCineSnapMovieIds(req,res))

adminRouter.get('/tickets/all', adminAuth, (req, res) => ticketController.getAllTickets(req,res))
adminRouter.patch('/tickets/cancel/:ticketId', adminAuth, (req, res) => ticketController.cancelTicket(req, res))

export default adminRouter