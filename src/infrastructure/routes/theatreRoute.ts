import express from "express";
import { theaterAuth } from "../middleware/theaterAuth";
import { tController, scnController, showController, chatController } from "../../providers/controllers";

// thr = theater
const thrRouter = express.Router()

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

thrRouter.get('/chat/users/:theaterId', (req, res) => chatController.getUsersChattedWith(req, res))
thrRouter.get('/chat/history', (req, res) => chatController.getChatHistory(req, res))

export default thrRouter