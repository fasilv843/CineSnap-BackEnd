import { IScreenRepo } from "../../interfaces/repos/screenRepo";
import { IScreenRequirements, IScreen } from "../../interfaces/schema/screenSchema";
import { screenModel } from "../../entities/models/screensModel";
import { theaterModel } from "../../entities/models/theaterModel"; 
import { ID } from "../../interfaces/common";
import mongoose from "mongoose";

export class ScreenRepository implements IScreenRepo {
    async saveScreen(screen: IScreenRequirements): Promise<IScreen | null> {
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

        const session = await mongoose.connection.startSession();

        try {
            let savedScreen: IScreen | null = null;
            await session.withTransaction(async () => {
                savedScreen = await new screenModel(screenData).save()
                await theaterModel.updateOne({_id: screen.theaterId}, { $inc: { screenCount: 1 }})  
            })
            await session.commitTransaction()
            return savedScreen
        } catch (error) {
            session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
        
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
            theaterId: screen.theaterId, name: screen.name,
            defaultPrice: screen.defaultPrice,
            row, col, seatsCount: rowCount * col,
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

    async deleteScreen (screenId: ID) {

        const session = await mongoose.connection.startSession(); // Use existing connection session

        try {
          await session.withTransaction(async () => {
            const screen = await screenModel.findById(screenId);
            if (!screen) throw Error('screen don\'t exist');
      
            await theaterModel.updateOne({ _id: screen.theaterId }, { $inc: { screenCount: -1 } });
            await screenModel.deleteOne({ _id: screenId });
          });
      
          await session.commitTransaction();
          console.log('Screen deleted successfully!');
        } catch (error) {
            console.error('Error deleting screen:', error);
            await session.abortTransaction();
        } finally {
          await session.endSession(); // Close session after transaction
        }
    }
}