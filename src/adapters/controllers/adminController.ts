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

            const verifiedData = await this.adminUseCase.verifyLogin(email, password)
            // if(verifiedData?.token !== '' ){
                res.status(verifiedData.status).json(verifiedData)
            // }else{
            //     res.status(400).json({message: 'token not valid'})
            // }
        } catch (error) {
            console.log(error);
        }
    }
}