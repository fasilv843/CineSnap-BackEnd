import { IScreenRepo } from "../../interfaces/repos/screenRepo";
import { IScreenRequirements, IScreen } from "../../interfaces/schema/screenSchema";
import { screenModel } from "../../entities/models/screensModel";
import { ID } from "../../interfaces/common";

export class ScreenRepository implements IScreenRepo {
    async saveScreen(screen: IScreenRequirements): Promise<IScreen> {
        console.log(screen, 'screen data from repository');
        const { row, col } = screen
        console.log(row, col);
        const rowCount = row.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        const screenData: Omit<IScreen, '_id'> = {
            theaterId: screen.theaterId,
            name: screen.name,
            defaultPrice: screen.defaultPrice,
            row,
            col,
            seatsCount: rowCount * col,
            seats: new Map()
        }

        // Populate an array with numbers from 1 to col
        const rowArr = Array.from({ length: col }, (_, index) => index + 1);

        for(let char = 'A'; char <= row; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
            screenData.seats.set(char, rowArr)
        }
        console.log(screenData, 'screen data that saved on db');
        return await new screenModel(screenData).save()
    }

    async findScreenById(id: ID): Promise<IScreen | null> {
        return await screenModel.findById({_id: id})
    }

    async findScreensInTheater(theaterId: ID): Promise<[] | IScreen[]> {
        return await screenModel.find({theaterId})
    }

    async editScreen (screenId: ID, screen: IScreenRequirements): Promise<IScreen | null> {
        const { row, col } = screen
        const rowCount = row.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        const screenData: Omit<IScreen, '_id'> = {
            theaterId: screen.theaterId,
            name: screen.name,
            defaultPrice: screen.defaultPrice,
            row,
            col,
            seatsCount: rowCount * col,
            seats: new Map()
        }

        // Populate an array with numbers from 1 to col
        const rowArr = Array.from({ length: col }, (_, index) => index + 1);

        for(let char = 'A'; char <= row; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
            screenData.seats.set(char, rowArr)
        }
        console.log(screenData, 'screen data that saved on db');
        return await screenModel.findOneAndReplace(
            { _id: screenId, theaterId: screen.theaterId },
            screenData,
            { new: true }
        )
    }
}