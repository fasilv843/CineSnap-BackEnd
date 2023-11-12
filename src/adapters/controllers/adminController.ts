import { Request, Response } from "express";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { IAdmin } from "../../interfaces/schema/adminSchema";



export class AdminController {
    constructor(
        private adminUseCase: AdminUseCase
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
}