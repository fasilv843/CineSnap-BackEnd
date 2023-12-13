import express from "express";
import { userAuth } from "../middleware/userAuth";
import { uController, tController, mController, chatController } from "../../providers/controllers";

const userRouter = express.Router()

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/auth/google', (req, res) => uController.userSocialSignUp(req, res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.get('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))

userRouter.put('/update/:userId', userAuth, (req,res) => uController.updateProfile(req,res))

userRouter.get('/get/:userId', userAuth,  (req,res) => uController.getUserData(req,res))
userRouter.get('/theaters', (req,res) => tController.loadTheaters(req,res))
userRouter.get('/theater/:theaterId', (req,res) => tController.getTheaterData(req,res))
userRouter.get('/movies', (req, res) => mController.getAvailableMovies(req, res))
userRouter.get('/filters', (req, res) => mController.getFilters(req, res))
userRouter.get('/chat/theaters/:userId', (req, res) => chatController.getTheatersChattedWith(req, res))

userRouter.get('/banner', (req, res) => mController.getBannerMovies(req, res))

export default userRouter
