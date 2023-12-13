import { Request, Response } from "express";
import { ChatUseCase } from "../../useCases/chatUseCase";
import { IChatReqs } from "../../interfaces/schema/chatSchems";
import { ID } from "../../interfaces/common";


export class ChatController {
    constructor(
        private readonly chatUseCase: ChatUseCase
    ) { }

    async getChatHistory (req: Request, res: Response) {
        const { userId, theaterId, adminId } = req.query as unknown as IChatReqs
        const apiRes = await this.chatUseCase.getChatHistory(userId, theaterId, adminId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTheatersChattedWith (req: Request, res: Response) {
        const userId = req.params.userId as unknown as ID
        const apiRes = await this.chatUseCase.getTheatersChattedWith(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getUsersChattedWith (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const apiRes = await this.chatUseCase.getUsersChattedWith(theaterId)
        res.status(apiRes.status).json(apiRes)
    }
}