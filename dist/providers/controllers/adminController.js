"use strict";
// import { AdminController } from "../../adapters/controllers/adminController"
// import { AdminUseCase } from "../../useCases/adminUseCase"
// import { TheaterUseCase } from "../../useCases/theaterUseCase"
// import { TicketUseCase } from "../../useCases/ticketUseCase"
// import { UserUseCase } from "../../useCases/userUseCase"
// import { TempUserRepository } from "../../infrastructure/repositories/tempUserRepository"
// import { UserRepository } from "../../infrastructure/repositories/userRepository"
// import { Encrypt } from "../bcryptPassword"
// import { JWTToken } from "../jwtToken"
// import { MailSender } from "../nodemailer"
// import { AdminRepository } from "../../infrastructure/repositories/adminRepository"
// import { ShowRepository } from "../../infrastructure/repositories/showRepository"
// import { ShowSeatsRepository } from "../../infrastructure/repositories/showSeatRepository"
// import { TempTheaterRepository } from "../../infrastructure/repositories/tempTheaterRepository"
// import { TempTicketRepository } from "../../infrastructure/repositories/tempTicketRepository"
// import { TheaterRepository } from "../../infrastructure/repositories/theaterRepository"
// import { TicketRepository } from "../../infrastructure/repositories/ticketRepository"
// import { GenerateOtp } from "../otpGenerator"
// import { CouponRepository } from "../../infrastructure/repositories/couponRepository"
// const encrypt = new Encrypt()
// const jwtToken = new JWTToken()
// const mailSender = new MailSender()
// const otpGenerator = new GenerateOtp()
// const adminRepository = new AdminRepository()
// const thrRepository = new TheaterRepository()
// const tempThrRepository = new TempTheaterRepository()
// const userRepository = new UserRepository()
// const tempUserRepository = new TempUserRepository()
// const showRepository = new ShowRepository()
// const showSeatRepository = new ShowSeatsRepository()
// const ticketRepository = new TicketRepository()
// const tempTicketRepository = new TempTicketRepository()
// const couponRepository = new CouponRepository()
// const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
// const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken,  mailSender)
// const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailSender, otpGenerator, ticketRepository)
// const ticketUseCase = new TicketUseCase(ticketRepository, tempTicketRepository, showRepository, showSeatRepository, thrRepository, userRepository, adminRepository, couponRepository, mailSender)
// export const aController = new AdminController(adminUseCase, userUseCase, thrUseCase, ticketUseCase)
