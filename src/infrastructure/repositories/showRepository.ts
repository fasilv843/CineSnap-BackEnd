import { screenModel } from "../../entities/models/screensModel";
// import { showModel } from "../../entities/models/showModel";
// import { theaterModel } from "../../entities/models/theaterModel";
import { ID } from "../../interfaces/common";
import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IShowRequirements, IShowRes } from "../../interfaces/schema/showSchema";




export class ShowRepository implements IShowRepo {
    saveShow(show: IShowRequirements): Promise<IShowRes> {
        console.log(show);
        throw new Error("Method not implemented.");
    }

    async findShowsOnDate  (theaterId: ID, date: Date): Promise<IShowRes[]> {
        console.log(date, 'date from repo');
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const shows = await screenModel.aggregate([
            { $match: { theaterId } },
            {
                $group: { _id: '$_id' }
            },
            {
                $lookup: {
                    from: 'Shows',
                    localField: '_id',
                    foreignField: 'screenId',
                    as: 'shows'
                }
            },
            {
                $unwind: '$shows'
            },
            {
                $match: {
                    'shows.startTime': { $gte: startOfDay, $lte: endOfDay }
                }
            }
        ])

        console.log(shows, 'shows from database');
        return shows
    }
}