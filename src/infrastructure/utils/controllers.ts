import { AdminController } from "../../adapters/controllers/adminController"
import { ChatController } from "../../adapters/controllers/chatController"
import { CouponController } from "../../adapters/controllers/couponController"
import { MovieController } from "../../adapters/controllers/movieController"
import { ScreenController } from "../../adapters/controllers/screenController"
import { ScreenSeatController } from "../../adapters/controllers/screenSeatController"
import { ShowController } from "../../adapters/controllers/showController"
import { ShowSeatController } from "../../adapters/controllers/showSeatsController"
import { TheaterController } from "../../adapters/controllers/theaterController"
import { TicketController } from "../../adapters/controllers/ticketController"
import { UserController } from "../../adapters/controllers/userController"
import { AdminRepository } from "../repositories/adminRepository"
import { ChatRepository } from "../repositories/chatRepository"
import { CouponRepository } from "../repositories/couponRepository"
import { MovieRepository } from "../repositories/movieRepository"
import { ScreenRepository } from "../repositories/screenRepository"
import { ScreenSeatRepository } from "../repositories/screenSeatRepository"
import { ShowRepository } from "../repositories/showRepository"
import { ShowSeatsRepository } from "../repositories/showSeatRepository"
import { TempTheaterRepository } from "../repositories/tempTheaterRepository"
import { TempTicketRepository } from "../repositories/tempTicketRepository"
import { TempUserRepository } from "../repositories/tempUserRepository"
import { TheaterRepository } from "../repositories/theaterRepository"
import { TicketRepository } from "../repositories/ticketRepository"
import { UserRepository } from "../repositories/userRepository"
import { AdminUseCase } from "../../useCases/adminUseCase"
import { ChatUseCase } from "../../useCases/chatUseCase"
import { CouponUseCase } from "../../useCases/couponUseCase"
import { MovieUseCase } from "../../useCases/movieUseCase"
import { ScreenSeatUseCase } from "../../useCases/screenSeatUseCase"
import { ScreenUseCase } from "../../useCases/screenUseCase"
import { ShowSeatsUseCase } from "../../useCases/showSeatUseCase"
import { ShowUseCase } from "../../useCases/showUseCase"
import { TheaterUseCase } from "../../useCases/theaterUseCase"
import { TicketUseCase } from "../../useCases/ticketUseCase"
import { UserUseCase } from "../../useCases/userUseCase"
import { Encrypt } from "./bcryptPassword"
import { JWTToken } from "./jwtToken"
import { MailSender } from "./nodemailer"
import { GenerateOtp } from "./otpGenerator"

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const adminRepository = new AdminRepository()
const userRepository = new UserRepository()
const thrRepository = new TheaterRepository()
const movieRepository = new MovieRepository()
const tempUserRepository = new TempUserRepository()
const tempThrRepository = new TempTheaterRepository()
const scnRepositoty = new ScreenRepository()
const screenSeatRepositoty = new ScreenSeatRepository()
const showRepository = new ShowRepository()
const showSeatRepository = new ShowSeatsRepository()
const chatRepository = new ChatRepository()
const ticketRepository = new TicketRepository()
const tempTicketRepository = new TempTicketRepository()
const couponRepository = new CouponRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken, mailSender)
const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailSender, otpGenerator, ticketRepository)
const movieUseCase = new MovieUseCase(movieRepository)
const scnUseCase = new ScreenUseCase(scnRepositoty, screenSeatRepositoty, thrRepository)
const showUseCase = new ShowUseCase(showRepository, movieRepository, scnRepositoty, screenSeatRepositoty, showSeatRepository)
export const chatUseCase = new ChatUseCase(chatRepository)
const ticketUseCase = new TicketUseCase(ticketRepository, tempTicketRepository, showRepository, showSeatRepository, thrRepository, userRepository, adminRepository, couponRepository, mailSender)
const screenSeatUseCase = new ScreenSeatUseCase(screenSeatRepositoty, scnRepositoty)
const showSeatUseCase = new ShowSeatsUseCase(showSeatRepository)
const couponUseCase = new CouponUseCase(couponRepository, thrRepository, tempTicketRepository, userRepository)

export const aController = new AdminController(adminUseCase, userUseCase, thrUseCase, ticketUseCase)
export const uController = new UserController(userUseCase, otpGenerator, encrypt )
export const tController = new TheaterController(thrUseCase)
export const mController = new MovieController(movieUseCase)
export const scnController = new ScreenController(scnUseCase)
export const showController = new ShowController(showUseCase)
export const chatController = new ChatController(chatUseCase)
export const ticketController = new TicketController(ticketUseCase)
export const screenSeatController = new ScreenSeatController(screenSeatUseCase)
export const showSeatsController = new ShowSeatController(showSeatUseCase)
export const couponController = new CouponController(couponUseCase)
