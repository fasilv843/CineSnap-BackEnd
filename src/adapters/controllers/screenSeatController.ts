import { Request, Response } from "express";
import { ScreenSeatUseCase } from "../../useCases/screenSeatUseCase";
import { IScreenSeatRes } from "../../interfaces/schema/screenSeatSchema";

export class ScreenSeatController {
    constructor(
      private readonly _screenSeatUseCase: ScreenSeatUseCase
    ) { }

    async findScreenSeatById (req: Request, res: Response) {
        const screenSeatId = req.params.seatId
        const screenSeatRes = await this._screenSeatUseCase.findScreenSeatById(screenSeatId)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }

    async updateScreenSeat (req: Request, res: Response) {
        const screenSeatId = req.params.seatId
        const { screenSeatData } = req.body as { screenSeatData: IScreenSeatRes }
        const screenSeatRes = await this._screenSeatUseCase.updateScreenSeat(screenSeatId, screenSeatData)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }
}