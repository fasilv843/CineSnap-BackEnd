import { Request, Response } from "express";
import { ScreenUseCase } from "../../useCases/screenUseCase";
import { IScreenRequirements } from "../../interfaces/schema/screenSchema";

export class ScreenController {
  constructor(
    private readonly _screenUseCase: ScreenUseCase
  ) { }

  // To Save Screen data of theaters
  async saveScreen(req: Request, res: Response) {
    const { name, rows, cols } = req.body as IScreenRequirements;
    const theaterId = req.params.theaterId
    const screen: IScreenRequirements = { theaterId, name, rows, cols };
    const apiRes = await this._screenUseCase.saveScreenDetails(screen)
    res.status(apiRes.status).json(apiRes)
  }

  // Finding screen data using id
  async findScreenById(req: Request, res: Response) {
    const screenId = req.params.screenId
    const apiRes = await this._screenUseCase.findScreenById(screenId)
    res.status(apiRes.status).json(apiRes)
  }

  // To find screens in a theater using theater id
  async findScreensInTheater(req: Request, res: Response) {
    const theaterId = req.params.theaterId
    const apiRes = await this._screenUseCase.findScreensInTheater(theaterId)
    // console.log(apiRes.data, 'screens that returned to client');
    res.status(apiRes.status).json(apiRes)
  }

  // To edit screen data of a theater
  async updateScreenName(req: Request, res: Response) {
    const screenName = req.body.screenName as string
    const screenId = req.params.screenId
    const apiRes = await this._screenUseCase.updateScreenName(screenId, screenName)
    res.status(apiRes.status).json(apiRes)
  }

  // To delete a screen from a theater
  async deleteScreen(req: Request, res: Response) {
    const screenId = req.params.screenId
    const apiRes = await this._screenUseCase.deleteScreen(screenId)
    res.status(apiRes.status).json(apiRes)
  }

  async getAvailSeatsOnScreen (req: Request, res: Response) {
    const screenId = req.params.screenId
    const apiRes = await this._screenUseCase.getAvailSeatsOnScreen(screenId)
    res.status(apiRes.status).json(apiRes)
  }
}