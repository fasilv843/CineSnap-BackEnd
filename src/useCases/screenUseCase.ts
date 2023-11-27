import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { STATUS_CODES } from "../constants/httpStausCodes";
import { IApiScreenRes, IApiScreensRes, IScreenRequirements } from "../interfaces/schema/screenSchema";
import { ID } from "../interfaces/common";

export class ScreenUseCase {
    constructor(
        private readonly screenRepository: ScreenRepository
    ) {}

    async saveScreenDetails (screen: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            const savedScreen = await this.screenRepository.saveScreen(screen)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: savedScreen
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }
    }

    async findScreenById(screenId: ID): Promise<IApiScreenRes>  {
        try {
            const screen = await this.screenRepository.findScreenById(screenId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: screen
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }
    }

    async findScreensInTheater(theaterId: ID): Promise<IApiScreensRes> {
        try {
            const screens = await this.screenRepository.findScreensInTheater(theaterId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: screens
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }

    async editScreen (screenId: ID, screenReq: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            const screenData = await this.screenRepository.editScreen(screenId, screenReq)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: screenData
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }
    }

    async deleteScreen (screenId: ID): Promise<IApiScreenRes> {
        try {
            // const screens = await this.screenRepository.findScreensInTheater(theaterId)
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: null
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: null
            }
        }
    }
}