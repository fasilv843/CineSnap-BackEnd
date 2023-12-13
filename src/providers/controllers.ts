import { AdminController } from "../adapters/controllers/adminController"
import { ChatController } from "../adapters/controllers/chatController"
import { MovieController } from "../adapters/controllers/movieController"
import { ScreenController } from "../adapters/controllers/screenController"
import { ShowController } from "../adapters/controllers/showController"
import { TheaterController } from "../adapters/controllers/theaterController"
import { UserController } from "../adapters/controllers/userController"
import { AdminRepository } from "../infrastructure/repositories/adminRepository"
import { ChatRepository } from "../infrastructure/repositories/chatRepository"
import { MovieRepository } from "../infrastructure/repositories/movieRepository"
import { ScreenRepository } from "../infrastructure/repositories/screenRepository"
import { ShowRepository } from "../infrastructure/repositories/showRepository"
import { TempTheaterRepository } from "../infrastructure/repositories/tempTheaterRepository"
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository"
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository"
import { UserRepository } from "../infrastructure/repositories/userRepository"
import { AdminUseCase } from "../useCases/adminUseCase"
import { ChatUseCase } from "../useCases/chatUseCase"
import { MovieUseCase } from "../useCases/movieUseCase"
import { ScreenUseCase } from "../useCases/screenUseCase"
import { ShowUseCase } from "../useCases/showUseCase"
import { TheaterUseCase } from "../useCases/theaterUseCase"
import { UserUseCase } from "../useCases/userUseCase"
import { Encrypt } from "./bcryptPassword"
import { JWTToken } from "./jwtToken"
import { MailSender } from "./nodemailer"
import { GenerateOtp } from "./otpGenerator"

const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailer = new MailSender()
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const adminRepository = new AdminRepository()
const userRepository = new UserRepository()
const thrRepository = new TheaterRepository()
const movieRepository = new MovieRepository()
const tempUserRepository = new TempUserRepository()
const tempThrRepository = new TempTheaterRepository()
const scnRepositoty = new ScreenRepository()
const showRepository = new ShowRepository()
const chatRepository = new ChatRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken,  mailSender)
const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailer, otpGenerator)
const movieUseCase = new MovieUseCase(movieRepository)
const scnUseCase = new ScreenUseCase(scnRepositoty)
const showUseCase = new ShowUseCase(showRepository)
export const chatUseCase = new ChatUseCase(chatRepository)

export const aController = new AdminController(adminUseCase, userUseCase, thrUseCase)
export const uController = new UserController(userUseCase, otpGenerator, encrypt )
export const tController = new TheaterController(thrUseCase)
export const mController = new MovieController(movieUseCase)
export const scnController = new ScreenController(scnUseCase)
export const showController = new ShowController(showUseCase)
export const chatController = new ChatController(chatUseCase)

