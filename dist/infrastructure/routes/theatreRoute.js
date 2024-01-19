"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const theaterAuth_1 = require("../middleware/theaterAuth");
const controllers_1 = require("../../providers/controllers");
const multer_1 = require("../config/multer");
// thr = theater
const thrRouter = express_1.default.Router();
thrRouter.post('/register', (req, res) => controllers_1.tController.theaterRegister(req, res));
thrRouter.post('/validateOTP', (req, res) => controllers_1.tController.validateTheaterOTP(req, res));
thrRouter.post('/login', (req, res) => controllers_1.tController.theaterLogin(req, res));
thrRouter.get('/resendOtp', (req, res) => controllers_1.tController.resendOTP(req, res));
thrRouter.get('/dashboard/revenue/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.tController.getRevenueData(req, res));
thrRouter.put('/update/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.tController.updateTheaterData(req, res));
thrRouter.patch('/update/profileimage/:theaterId', theaterAuth_1.theaterAuth, multer_1.upload.single('image'), (req, res) => controllers_1.tController.updateTheaterProfilePic(req, res));
thrRouter.patch('/remove/profileimage/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.tController.removeTheaterProfilePic(req, res));
thrRouter.get('/screens/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.findScreensInTheater(req, res));
thrRouter.post('/screens/add/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.saveScreen(req, res));
thrRouter.get('/screens/get/:screenId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.findScreenById(req, res));
thrRouter.patch('/screens/edit/:screenId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.updateScreenName(req, res));
thrRouter.delete('/screens/delete/:screenId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.deleteScreen(req, res));
thrRouter.get('/screens/seat/:seatId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.screenSeatController.findScreenSeatById(req, res));
thrRouter.put('/screens/seat/update/:seatId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.screenSeatController.updateScreenSeat(req, res));
thrRouter.get('/screens/get/seats/:screenId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.scnController.getAvailSeatsOnScreen(req, res));
// thrRouter.delete('/screens/seat/delete/:seatId', theaterAuth, (req, res) => screenSeatController.deleteScreenSeat(req, res))
thrRouter.get('/shows/:theaterId', (req, res) => controllers_1.showController.findShowsOnTheater(req, res));
thrRouter.post('/show/add', theaterAuth_1.theaterAuth, (req, res) => controllers_1.showController.addShow(req, res));
// thrRouter.get('/show/get/:showId', theaterAuth, (req, res) => showController.getShowDetails(req, res))
thrRouter.get('/chat/users/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.chatController.getUsersChattedWith(req, res));
thrRouter.get('/chat/history', theaterAuth_1.theaterAuth, (req, res) => controllers_1.chatController.getChatHistory(req, res));
thrRouter.patch('/chat/mark/read', theaterAuth_1.theaterAuth, (req, res) => controllers_1.chatController.markLastMsgAsRead(req, res));
thrRouter.patch('/wallet/add/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.tController.addToWallet(req, res));
thrRouter.get('/wallet-history/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.tController.getWalletHistory(req, res));
thrRouter.get('/tickets/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.ticketController.getTicketsOfTheater(req, res));
thrRouter.patch('/tickets/cancel/:ticketId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.ticketController.cancelTicket(req, res));
thrRouter.post('/coupon/save', theaterAuth_1.theaterAuth, (req, res) => controllers_1.couponController.addCoupon(req, res));
thrRouter.get('/coupons/theater-coupons/:theaterId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.couponController.getCouponsOnTheater(req, res));
thrRouter.patch('/coupons/cancel/:couponId', theaterAuth_1.theaterAuth, (req, res) => controllers_1.couponController.cancelCoupon(req, res));
exports.default = thrRouter;
