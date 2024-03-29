import { Request, Response } from "express";
import { ChatUseCase } from "../../application/useCases/chatUseCase";
import { IChatReadReqs, IChatReqs } from "../../application/interfaces/types/chat";

export class ChatController {
    constructor(
        private readonly _chatUseCase: ChatUseCase
    ) { }

    async getChatHistory (req: Request, res: Response) {
        const { userId, theaterId, adminId } = req.query as unknown as IChatReqs
        const apiRes = await this._chatUseCase.getChatHistory(userId, theaterId, adminId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTheatersChattedWith (req: Request, res: Response) {
        const userId = req.params.userId
        const apiRes = await this._chatUseCase.getTheatersChattedWith(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getUsersChattedWith (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const apiRes = await this._chatUseCase.getUsersChattedWith(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async markLastMsgAsRead (req: Request, res: Response) {
        const { userId, theaterId, adminId, msgId } = req.query as unknown as IChatReadReqs
        const msgData: IChatReadReqs = { userId, theaterId, adminId, msgId }
        const apiRes = await this._chatUseCase.markLastMsgAsRead(msgData)
        res.status(apiRes.status).json(apiRes)
    }
}