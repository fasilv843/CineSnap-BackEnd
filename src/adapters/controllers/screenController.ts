import { Request, Response } from "express";
import { ScreenUseCase } from "../../useCases/screenUseCase";
import { IScreenRequirements } from "../../interfaces/schema/screenSchema";
import { ID } from "../../interfaces/common";

export class ScreenController {
  constructor(
    private readonly screenUseCase: ScreenUseCase
  ) { }

  // To Save Screen data of theaters
  async saveScreen(req: Request, res: Response) {
    const { name, rows, cols } = req.body as IScreenRequirements;
    const theaterId = req.params.theaterId as unknown as ID
    const screen: IScreenRequirements = { theaterId, name, rows, cols };
    const apiRes = await this.screenUseCase.saveScreenDetails(screen)
    res.status(apiRes.status).json(apiRes)
  }

  // Finding screen data using id
  async findScreenById(req: Request, res: Response) {
    const screenId: ID = req.params.screenId as unknown as ID
    const apiRes = await this.screenUseCase.findScreenById(screenId)
    res.status(apiRes.status).json(apiRes)
  }

  // To find screens in a theater using theater id
  async findScreensInTheater(req: Request, res: Response) {
    const theaterId = req.params.theaterId as unknown as ID
    const apiRes = await this.screenUseCase.findScreensInTheater(theaterId)
    // console.log(apiRes.data, 'screens that returned to client');
    res.status(apiRes.status).json(apiRes)
  }

  // To edit screen data of a theater
  async editScreen(req: Request, res: Response) {
    const { name, rows, cols, theaterId } = req.body as IScreenRequirements;
    const screenId: ID = req.params.screenId as unknown as ID
    const screen: IScreenRequirements = { theaterId, name, rows, cols };
    const apiRes = await this.screenUseCase.editScreen(screenId, screen)
    res.status(apiRes.status).json(apiRes)
  }

  // To delete a screen from a theater
  async deleteScreen(req: Request, res: Response) {
    const screenId: ID = req.params.screenId as unknown as ID
    const apiRes = await this.screenUseCase.deleteScreen(screenId)
    res.status(apiRes.status).json(apiRes)
  }
}