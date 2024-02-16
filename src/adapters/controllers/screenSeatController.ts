import { Request, Response } from "express";
import { ScreenSeatUseCase } from "../../useCases/screenSeatUseCase";
import { IScreenSeatRes } from "../../interfaces/schema/screenSeatSchema";

export class ScreenSeatController {
    constructor(
      private readonly screenSeatUseCase: ScreenSeatUseCase
    ) { }

    async findScreenSeatById (req: Request, res: Response) {
        const screenSeatId = req.params.seatId
        const screenSeatRes = await this.screenSeatUseCase.findScreenSeatById(screenSeatId)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }

    async updateScreenSeat (req: Request, res: Response) {
        const screenSeatId = req.params.seatId
        const { screenSeatData } = req.body as { screenSeatData: IScreenSeatRes }
        const screenSeatRes = await this.screenSeatUseCase.updateScreenSeat(screenSeatId, screenSeatData)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }
}