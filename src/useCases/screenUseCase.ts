import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { IApiScreenRes, IApiScreensRes, IScreenRequirements } from "../interfaces/schema/screenSchema";
import { ID } from "../interfaces/common";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";

export class ScreenUseCase {
    constructor(
        private readonly screenRepository: ScreenRepository
    ) {}

    async saveScreenDetails (screen: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            const savedScreen = await this.screenRepository.saveScreen(screen)
            if (savedScreen) return get200Response(savedScreen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreenById(screenId: ID): Promise<IApiScreenRes>  {
        try {
            const screen = await this.screenRepository.findScreenById(screenId)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreensInTheater(theaterId: ID): Promise<IApiScreensRes> {
        try {
            const screens = await this.screenRepository.findScreensInTheater(theaterId)
            return get200Response(screens)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async editScreen (screenId: ID, screenReq: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            const screen = await this.screenRepository.editScreen(screenId, screenReq)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async deleteScreen (screenId: ID): Promise<IApiScreenRes> {
        try {
            await this.screenRepository.deleteScreen(screenId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}