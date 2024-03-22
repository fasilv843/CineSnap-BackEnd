"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponController = exports.showSeatsController = exports.screenSeatController = exports.ticketController = exports.chatController = exports.showController = exports.scnController = exports.mController = exports.tController = exports.uController = exports.aController = exports.chatUseCase = void 0;
const adminController_1 = require("../../adapters/controllers/adminController");
const chatController_1 = require("../../adapters/controllers/chatController");
const couponController_1 = require("../../adapters/controllers/couponController");
const movieController_1 = require("../../adapters/controllers/movieController");
const screenController_1 = require("../../adapters/controllers/screenController");
const screenSeatController_1 = require("../../adapters/controllers/screenSeatController");
const showController_1 = require("../../adapters/controllers/showController");
const showSeatsController_1 = require("../../adapters/controllers/showSeatsController");
const theaterController_1 = require("../../adapters/controllers/theaterController");
const ticketController_1 = require("../../adapters/controllers/ticketController");
const userController_1 = require("../../adapters/controllers/userController");
const adminRepository_1 = require("../repositories/adminRepository");
const chatRepository_1 = require("../repositories/chatRepository");
const couponRepository_1 = require("../repositories/couponRepository");
const movieRepository_1 = require("../repositories/movieRepository");
const screenRepository_1 = require("../repositories/screenRepository");
const screenSeatRepository_1 = require("../repositories/screenSeatRepository");
const showRepository_1 = require("../repositories/showRepository");
const showSeatRepository_1 = require("../repositories/showSeatRepository");
const tempTheaterRepository_1 = require("../repositories/tempTheaterRepository");
const tempTicketRepository_1 = require("../repositories/tempTicketRepository");
const tempUserRepository_1 = require("../repositories/tempUserRepository");
const theaterRepository_1 = require("../repositories/theaterRepository");
const ticketRepository_1 = require("../repositories/ticketRepository");
const userRepository_1 = require("../repositories/userRepository");
const adminUseCase_1 = require("../../application/useCases/adminUseCase");
const chatUseCase_1 = require("../../application/useCases/chatUseCase");
const couponUseCase_1 = require("../../application/useCases/couponUseCase");
const movieUseCase_1 = require("../../application/useCases/movieUseCase");
const screenSeatUseCase_1 = require("../../application/useCases/screenSeatUseCase");
const screenUseCase_1 = require("../../application/useCases/screenUseCase");
const showSeatUseCase_1 = require("../../application/useCases/showSeatUseCase");
const showUseCase_1 = require("../../application/useCases/showUseCase");
const theaterUseCase_1 = require("../../application/useCases/theaterUseCase");
const ticketUseCase_1 = require("../../application/useCases/ticketUseCase");
const userUseCase_1 = require("../../application/useCases/userUseCase");
const bcryptPassword_1 = require("./bcryptPassword");
const jwtToken_1 = require("./jwtToken");
const nodemailer_1 = require("./nodemailer");
const otpGenerator_1 = require("./otpGenerator");
// Utils
const encryptor = new bcryptPassword_1.Encryptor();
const tokenGenerator = new jwtToken_1.TokenGenerator();
const mailSender = new nodemailer_1.MailSender();
const otpGenerator = new otpGenerator_1.OTPGenerator();
// Repositories
const adminRepository = new adminRepository_1.AdminRepository();
const userRepository = new userRepository_1.UserRepository();
const thrRepository = new theaterRepository_1.TheaterRepository();
const movieRepository = new movieRepository_1.MovieRepository();
const tempUserRepository = new tempUserRepository_1.TempUserRepository();
const tempThrRepository = new tempTheaterRepository_1.TempTheaterRepository();
const scnRepository = new screenRepository_1.ScreenRepository();
const screenSeatRepository = new screenSeatRepository_1.ScreenSeatRepository();
const showRepository = new showRepository_1.ShowRepository();
const showSeatRepository = new showSeatRepository_1.ShowSeatsRepository();
const chatRepository = new chatRepository_1.ChatRepository();
const ticketRepository = new ticketRepository_1.TicketRepository();
const tempTicketRepository = new tempTicketRepository_1.TempTicketRepository();
const couponRepository = new couponRepository_1.CouponRepository();
// Use Cases
const adminUseCase = new adminUseCase_1.AdminUseCase(encryptor, adminRepository, tokenGenerator);
const userUseCase = new userUseCase_1.UserUseCase(userRepository, tempUserRepository, encryptor, tokenGenerator, mailSender);
const thrUseCase = new theaterUseCase_1.TheaterUseCase(thrRepository, tempThrRepository, ticketRepository, encryptor, tokenGenerator, mailSender, otpGenerator);
const movieUseCase = new movieUseCase_1.MovieUseCase(movieRepository);
const scnUseCase = new screenUseCase_1.ScreenUseCase(scnRepository, screenSeatRepository, thrRepository);
const showUseCase = new showUseCase_1.ShowUseCase(showRepository, movieRepository, scnRepository, screenSeatRepository, showSeatRepository);
exports.chatUseCase = new chatUseCase_1.ChatUseCase(chatRepository);
const ticketUseCase = new ticketUseCase_1.TicketUseCase(ticketRepository, tempTicketRepository, showRepository, showSeatRepository, thrRepository, userRepository, adminRepository, couponRepository, mailSender);
const screenSeatUseCase = new screenSeatUseCase_1.ScreenSeatUseCase(screenSeatRepository, scnRepository);
const showSeatUseCase = new showSeatUseCase_1.ShowSeatsUseCase(showSeatRepository);
const couponUseCase = new couponUseCase_1.CouponUseCase(couponRepository, thrRepository, tempTicketRepository, userRepository);
// Controllers
exports.aController = new adminController_1.AdminController(adminUseCase, userUseCase, thrUseCase, ticketUseCase);
exports.uController = new userController_1.UserController(userUseCase, otpGenerator, encryptor);
exports.tController = new theaterController_1.TheaterController(thrUseCase);
exports.mController = new movieController_1.MovieController(movieUseCase);
exports.scnController = new screenController_1.ScreenController(scnUseCase);
exports.showController = new showController_1.ShowController(showUseCase);
exports.chatController = new chatController_1.ChatController(exports.chatUseCase);
exports.ticketController = new ticketController_1.TicketController(ticketUseCase);
exports.screenSeatController = new screenSeatController_1.ScreenSeatController(screenSeatUseCase);
exports.showSeatsController = new showSeatsController_1.ShowSeatController(showSeatUseCase);
exports.couponController = new couponController_1.CouponController(couponUseCase);