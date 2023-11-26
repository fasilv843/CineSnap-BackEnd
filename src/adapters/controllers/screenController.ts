import { Request, Response } from "express";
import { ScreenUseCase } from "../../useCases/screenUseCase";
import { IScreenRequirements } from "../../interfaces/schema/screenSchema";
import { ID } from "../../interfaces/common";

export class ScreenController {
  constructor(
    private readonly screenUseCase: ScreenUseCase
  ) { }

  async saveScreen(req: Request, res: Response) {
    const { name, defaultPrice, row, col } = req.body as IScreenRequirements;
    const theaterId = req.params.theaterId as unknown as ID
    const screen: IScreenRequirements = { theaterId, name, defaultPrice, row, col };
    const apiRes = await this.screenUseCase.saveScreenDetails(screen)
    res.status(apiRes.status).json(apiRes)
  }

  async findScreenById(req: Request, res: Response) {
    const screenId: ID = req.body.screenId
    const apiRes = await this.screenUseCase.findScreenById(screenId)
    res.status(apiRes.status).json(apiRes)
  }

  async findScreensInTheater(req: Request, res: Response) {
    const theaterId = req.params.theaterId as unknown as ID
    const apiRes = await this.screenUseCase.findScreensInTheater(theaterId)
    console.log(apiRes.data, 'screens that returned to client');
    res.status(apiRes.status).json(apiRes)
  }
}