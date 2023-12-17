import { Request, Response } from "express";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { STATUS_CODES } from "../../constants/httpStausCodes";
import { UserUseCase } from "../../useCases/userUseCase";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ID } from "../../interfaces/common";


export class AdminController {
    constructor(
        private readonly adminUseCase: AdminUseCase,
        private readonly userUseCase: UserUseCase,
        private readonly theaterUseCase: TheaterUseCase
    ) {}

    async adminLogin(req:Request, res: Response ) {
        try {
            const { email, password } = req.body as IAdmin
            const authData = await this.adminUseCase.verifyLogin(email, password)
            res.status(authData.status).json(authData)
        } catch (error) {
            console.log(error);
        }
    }

    async getAllUsers (req:Request, res: Response ) {
        try {
            const apiRes = await this.userUseCase.getUsers()
            res.status(apiRes.status).json(apiRes)
        } catch (error) {
            const err = error as Error
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message })
        }
    }

    async getAllTheaters (req:Request, res: Response ) {
        try {
            const apiRes = await this.theaterUseCase.getAllTheaters()
            res.status(apiRes.status).json(apiRes)
        } catch (error) {
            const err = error as Error
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message })
        }
    }

    async blockUser (req: Request, res: Response) {
        try {
            // console.log(req.params, 'req.params');
            await this.userUseCase.blockUser(req.params.userId as string)
            res.status(STATUS_CODES.OK).json()
        } catch (error) {
            const err = error as Error
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message })
        }
    }

    async blockTheater (req: Request, res: Response) {
        try {
            // console.log(req.params, 'req.params');
            await this.theaterUseCase.blockTheater(req.params.theaterId as string)
            res.status(STATUS_CODES.OK).json()
        } catch (error) {
            const err = error as Error
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message })
        }
    }

    async theaterApproval (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const action = req.query.action
        const apiRes = this.theaterUseCase.theaterApproval(theaterId, action)
    }
}