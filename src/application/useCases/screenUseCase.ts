import { STATUS_CODES } from "../../infrastructure/constants/httpStatusCodes";
import { IApiScreenRes, IApiScreensRes, IScreenRequirements } from "../interfaces/types/screen";
import { IApiRes } from "../interfaces/types/common";
import { get200Response, get500Response, getErrorResponse } from "../../infrastructure/helperFunctions/response";
import { getAvailSeatData, getDefaultScreenSeatSetup } from "../../infrastructure/helperFunctions/getScreenSeat";
import mongoose from "mongoose";
import { log } from "console";
import { IAvailCatsOnScreen } from "../interfaces/types/screenSeat";
import { IScreen } from "../../entities/screen";
import { IScreenRepo } from "../interfaces/repos/screenRepo";
import { IScreenSeatRepo } from "../interfaces/repos/screenSeatRepo";
import { ITheaterRepo } from "../interfaces/repos/theaterRepo";

export class ScreenUseCase {
    constructor(
        private readonly _screenRepository: IScreenRepo,
        private readonly _screenSeatRepository: IScreenSeatRepo,
        private readonly _theaterRepository: ITheaterRepo
    ) {}

    async saveScreenDetails (screen: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            const { rows, cols, name, theaterId } = screen
            const rowCount = rows.charCodeAt(0) - 'A'.charCodeAt(0) + 1
            const defaultScreenSeats = getDefaultScreenSeatSetup(rows, cols)
            
            const session = await mongoose.connection.startSession();
            
            try {
                let savedScreen: IScreen | null = null;
                await session.withTransaction(async () => {
                    // saving screen seat data
                    const savedScreenSeat = await this._screenSeatRepository.saveScreenSeat(defaultScreenSeats)
        
                    // Saving Screen
                    const screenData: Omit<IScreen, '_id'> = {
                        theaterId, name, rows, cols,
                        seatsCount: rowCount * cols,
                        seatId: savedScreenSeat._id
                    }
                    savedScreen = await this._screenRepository.saveScreen(screenData)

                    // updating seat count in theater data
                    await this._theaterRepository.updateScreenCount(theaterId, 1)
                })
                await session.commitTransaction()
                log(savedScreen, 'saved screen from saveScreen Use Case')
                return get200Response(savedScreen)
            } catch (error) {
                session.abortTransaction()
                return get500Response(error as Error)
            } finally {
                session.endSession()
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreenById(screenId: string): Promise<IApiScreenRes>  {
        try {
            const screen = await this._screenRepository.findScreenById(screenId)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreensInTheater(theaterId: string): Promise<IApiScreensRes> {
        try {
            const screens = await this._screenRepository.findScreensInTheater(theaterId)
            return get200Response(screens)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateScreenName (screenId: string, screenName: string): Promise<IApiScreenRes> {
        try {
            const screen = await this._screenRepository.updateScreenName(screenId, screenName)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async deleteScreen (screenId: string): Promise<IApiScreenRes> {
        try {
            const screen = await this._screenRepository.deleteScreen(screenId)
            if (screen) {
                await this._screenSeatRepository.deleteScreenSeat(screen.seatId)
                await this._theaterRepository.updateScreenCount(screen.theaterId, -1)
                return get200Response(null)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid Request')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getAvailSeatsOnScreen (screenId: string): Promise<IApiRes<IAvailCatsOnScreen | null>> {
        try {
            const screen = await this._screenRepository.findScreenById(screenId)
            if (screen) {
                const screenSeat = await this._screenSeatRepository.findScreenSeatById(screen.seatId)
                if (screenSeat) {
                    const { diamond, gold, silver } = screenSeat
                    return get200Response({
                        diamond: getAvailSeatData(diamond),
                        gold: getAvailSeatData(gold),
                        silver: getAvailSeatData(silver),
                    })
                } else {
                    return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong while fetching seat data')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid Screen Id')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}