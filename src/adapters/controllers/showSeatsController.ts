import { Request, Response } from "express"
import { ShowSeatsUseCase } from "../../useCases/showSeatUseCase"

export class ShowSeatController {
    constructor(
      private readonly showSeatUseCase: ShowSeatsUseCase
    ) { }

    async findShowSeatById (req: Request, res: Response) {
        const showSeatId = req.params.showSeatId
        const showSeatRes = await this.showSeatUseCase.findShowSeatById(showSeatId)
        res.status(showSeatRes.status).json(showSeatRes)
    }
}