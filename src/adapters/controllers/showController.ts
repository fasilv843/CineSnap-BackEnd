import { Request, Response } from "express";
import { ShowUseCase } from "../../application/useCases/showUseCase";
import { IShowRequirements } from "../../application/interfaces/types/show";


export class ShowController {
    constructor (
        private readonly _showUseCase: ShowUseCase
    ) {}

    // To find all the shows on a theater on a specific day
    async findShowsOnTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const date = req.query.date as string | undefined
        const apiRes = await this._showUseCase.findShowsOnTheater(theaterId, date, 'Theater')
        res.status(apiRes.status).json(apiRes)
    }

    async findShowsOnTheaterByUser (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const date = req.query.date as string | undefined
        const apiRes = await this._showUseCase.findShowsOnTheater(theaterId, date, 'User')
        res.status(apiRes.status).json(apiRes)
    }

    // To add a new show
    async addShow (req: Request, res: Response) {
        const showReqs: IShowRequirements = req.body
        const apiRes = await this._showUseCase.addShow(showReqs)
        res.status(apiRes.status).json(apiRes)
    }

    async getShowDetails (req: Request, res: Response) {
        const showId = req.params.showId
        const apiRes = await this._showUseCase.getShowDetails(showId)
        res.status(apiRes.status).json(apiRes)
    }
}