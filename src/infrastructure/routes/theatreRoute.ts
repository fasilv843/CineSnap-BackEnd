import express from "express";
import { theaterAuth } from "../middleware/theaterAuth";
import { tController, scnController, showController, chatController, ticketController, screenSeatController } from "../../providers/controllers";
import { upload } from "../config/multer";

// thr = theater
const thrRouter = express.Router()

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))
thrRouter.get('/resendOtp', (req, res) => tController.resendOTP(req, res))

thrRouter.put('/update/:theaterId', theaterAuth, (req, res) => tController.updateTheaterData(req, res))
thrRouter.patch('/update/profileimage/:theaterId', theaterAuth, upload.single('image'), (req,res) => tController.updateTheaterProfilePic(req,res))
thrRouter.patch('/remove/profileimage/:theaterId', theaterAuth, (req,res) => tController.removeTheaterProfilePic(req,res))

thrRouter.get('/screens/:theaterId', theaterAuth, (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', theaterAuth, (req, res) => scnController.saveScreen(req, res))
thrRouter.get('/screens/get/:screenId', theaterAuth, (req, res) => scnController.findScreenById(req, res))
thrRouter.patch('/screens/edit/:screenId', theaterAuth, (req, res) => scnController.updateScreenName(req, res))
thrRouter.delete('/screens/delete/:screenId', theaterAuth, (req, res) => scnController.deleteScreen(req, res))

thrRouter.get('/screens/seat/:seatId', theaterAuth, (req, res) => screenSeatController.findScreenSeatById(req, res))
thrRouter.put('/screens/seat/update/:seatId', theaterAuth, (req, res) => screenSeatController.updateScreenSeat(req, res))
thrRouter.get('/screens/get/seats/:screenId', theaterAuth, (req, res) => scnController.getAvailSeatsOnScreen(req, res))
// thrRouter.delete('/screens/seat/delete/:seatId', theaterAuth, (req, res) => screenSeatController.deleteScreenSeat(req, res))

thrRouter.get('/shows/:theaterId', (req, res) => showController.findShowsOnTheater(req, res))
thrRouter.post('/show/add', theaterAuth, (req, res) => showController.addShow(req, res))
// thrRouter.get('/show/get/:showId', theaterAuth, (req, res) => showController.getShowDetails(req, res))

thrRouter.get('/chat/users/:theaterId', theaterAuth, (req, res) => chatController.getUsersChattedWith(req, res))
thrRouter.get('/chat/history', theaterAuth, (req, res) => chatController.getChatHistory(req, res))
thrRouter.patch('/chat/mark/read', theaterAuth, (req, res) => chatController.markLastMsgAsRead(req, res))

thrRouter.patch('/wallet/add/:theaterId', theaterAuth, (req, res) => tController.addToWallet(req, res))

thrRouter.get('/tickets/:theaterId', theaterAuth, (req, res) => ticketController.getTicketsOfTheater(req, res))
thrRouter.patch('/tickets/cancel/:ticketId', theaterAuth, (req, res) => ticketController.cancelTicketByTheater(req, res))

export default thrRouter