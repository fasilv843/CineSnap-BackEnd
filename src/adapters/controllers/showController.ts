import { Request, Response } from "express";
import { ShowUseCase } from "../../useCases/showUseCase";
import { ID } from "../../interfaces/common";
import { IShowRequirements } from "../../interfaces/schema/showSchema";


export class ShowController {
    constructor (
        private readonly showUseCase: ShowUseCase
    ) {}

    // To find all the shows on a theater on a specific day
    async findShowsOnTheater (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const date = req.query.date as string | undefined
        const apiRes = await this.showUseCase.findShowsOnTheater(theaterId, date, 'Theater')
        res.status(apiRes.status).json(apiRes)
    }

    async findShowsOnTheaterByUser (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const date = req.query.date as string | undefined
        const apiRes = await this.showUseCase.findShowsOnTheater(theaterId, date, 'User')
        res.status(apiRes.status).json(apiRes)
    }

    // To add a new show
    async addShow (req: Request, res: Response) {
        const showReqs: IShowRequirements = req.body
        const apiRes = await this.showUseCase.addShow(showReqs)
        res.status(apiRes.status).json(apiRes)
    }

    async getShowDetails (req: Request, res: Response) {
        const showId = req.params.showId as unknown as ID
        const apiRes = await this.showUseCase.getShowDetails(showId)
        res.status(apiRes.status).json(apiRes)
    }

    // Edit single fields instead of all details all at once
    // async editShow (req: Request, res: Response) {
    //     const showReqs: IShowRequirements = req.body
    //     const showId = req.params.showId as unknown as ID
    //     const apiRes = await this.showUseCase.editShow(showId, showReqs)
    //     res.status(apiRes.status).json(apiRes)
    // }
}