import express from "express";
import { userAuth } from "../middleware/userAuth";
import { uController, tController, mController, chatController, showController, ticketController, showSeatsController, couponController } from "../utils/controllers";
import { upload } from "../config/multer";

const userRouter = express.Router()

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/auth/google', (req, res) => uController.userSocialSignUp(req, res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.get('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))

userRouter.put('/update/:userId', userAuth, (req,res) => uController.updateProfile(req,res))
userRouter.patch('/update/profileimage/:userId', userAuth, upload.single('image'), (req,res) => uController.updateUserProfileDp(req,res))
userRouter.patch('/remove/profileimage/:userId', userAuth, (req,res) => uController.removeUserProfileDp(req,res))

userRouter.get('/get/:userId', userAuth,  (req,res) => uController.getUserData(req,res))
userRouter.get('/theaters', (req,res) => tController.loadTheaters(req,res))
userRouter.get('/theater/:theaterId', (req,res) => tController.getTheaterData(req,res))
userRouter.get('/movies', (req, res) => mController.getMovies(req, res))
userRouter.get('/movies/get/:movieId', (req, res) => mController.getMovieDetails(req, res))
userRouter.get('/filters', (req, res) => mController.getFilters(req, res))

userRouter.get('/chat/theaters/:userId', userAuth, (req, res) => chatController.getTheatersChattedWith(req, res))
userRouter.get('/chat/history', userAuth, (req, res) => chatController.getChatHistory(req, res))

userRouter.get('/banner', (req, res) => mController.getBannerMovies(req, res))

userRouter.get('/theater/show/get/:showId', userAuth, (req, res) => showController.getShowDetails(req, res))
userRouter.get('/show/seats/holded/:showId', userAuth, (req, res) => ticketController.getHoldedSeats(req, res))
userRouter.post('/book/ticket', userAuth, (req, res) => ticketController.bookTicket(req, res))
userRouter.get('/tempticket/get/:ticketId', userAuth, (req, res) => ticketController.getTempTicketData(req, res))

userRouter.post('/show/book/confirm/ticket', userAuth, (req, res) => ticketController.confirmTicket(req, res))
userRouter.get('/show/ticket/get/:ticketId', userAuth, (req, res) => ticketController.getTicketData(req, res))
userRouter.get('/shows/:theaterId', (req, res) => showController.findShowsOnTheaterByUser(req, res))

userRouter.get('/shows/seats/:showSeatId', (req, res) => showSeatsController.findShowSeatById(req, res))

userRouter.get('/tickets/:userId', userAuth, (req, res) => ticketController.getTicketsOfUser(req, res))
userRouter.patch('/ticket/cancel/:ticketId', userAuth, (req, res) => ticketController.cancelTicket(req, res))
userRouter.post('/tickets/invoice/mail', userAuth, (req, res) => ticketController.sendInvoiceMail(req, res))

userRouter.patch('/wallet/add/:userId', userAuth, (req, res) => uController.addToWallet(req, res))
userRouter.get('/wallet-history/:userId', userAuth, (req, res) => uController.getWalletHistory(req, res))

userRouter.get('/coupons/applicable-coupons/:userId', userAuth, (req, res) => couponController.getApplicableCoupons(req, res))

export default userRouter
