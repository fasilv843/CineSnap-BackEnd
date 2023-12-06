import { STATUS_CODES } from "../constants/httpStausCodes";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { ID } from "../interfaces/common";
import { IApiShowsRes } from "../interfaces/schema/showSchema";

export class ShowUseCase {
    constructor (
        private showRepository: ShowRepository
    ) {}

    async findShowsOnTheater (theaterId: ID, dateStr: string | undefined): Promise<IApiShowsRes> {
        try {
            if (dateStr === undefined || isNaN(new Date(dateStr).getTime())) {
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Date is not available or invalid',
                    data: []
                }
            }else {
                const date = new Date(dateStr)
                console.log(typeof date, 'type from usecase')
                const shows = await this.showRepository.findShowsOnDate(theaterId, date)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: shows
                }
            }
        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
                data: []
            }
        }
    }
}