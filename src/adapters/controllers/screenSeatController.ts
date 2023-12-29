import { Request, Response } from "express";
import { ScreenSeatUseCase } from "../../useCases/screenSeatUseCase";
import { ID } from "../../interfaces/common";

export class ScreenSeatController {
    constructor(
      private readonly screenSeatUseCase: ScreenSeatUseCase
    ) { }

    async findScreenSeatById (req: Request, res: Response) {
        const screenSeatId = req.params.seatId as unknown as ID
        const screenSeatRes = await this.screenSeatUseCase.findScreenSeatById(screenSeatId)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }
}