import { screenModel } from "../db/screensModel";
import { showModel } from "../db/showModel";
import { IShowRepo } from "../../useCases/repos/showRepo";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { IScreen } from "../../interfaces/schema/screenSchema";
import { IShow, IShowRes, IShowToSave, IShowsOnAScreen } from "../../interfaces/schema/showSchema";

export class ShowRepository implements IShowRepo {

    async saveShow (showTosave: IShowToSave): Promise<IShow> {
        return await new showModel(showTosave).save()
    }

    async findShowsOnDate  (theaterId: string, from: Date, to: Date): Promise<IShowsOnAScreen[]> {

        // Step 1: Find screens that match the theaterId
        const screens = await screenModel.find({ theaterId }) as unknown as IScreen[]

        // Step 2: Get shows for each screen within the specified time range
        const showsPromises = screens.map(async (screen) => {
            const screenShows = await showModel.find({
                screenId: screen._id,
                startTime: { $gte: from, $lte: to }
            }).populate('movieId')

            const movieShowsMap: Record<string, IShowRes> = screenShows.reduce((acc: Record<string, IShowRes>, screen) => {
                const { movieId, ...rest } = JSON.parse(JSON.stringify(screen));
                const movie = movieId as unknown as IMovie
                if (!acc[movie._id]) {
                    acc[movie._id] = {
                        movieId: movie,
                        shows: []
                    };
                }
                acc[movie._id].shows.push(rest);
                return acc;
            }, {});
            
            const movieShows = Object.values(movieShowsMap);
                      
            
            return {
                screenId: screen._id,
                screenName: screen.name,
                shows: movieShows
            };
        });

        // Step 3: Wait for all show queries to complete
        return await Promise.all(showsPromises) 
    }

    async getShowDetails (showId: string): Promise<IShow | null> {
        return await showModel.findById(showId).populate('movieId')
    }

    async getCollidingShowsOnTheScreen (screenId: string, startTime: Date, endTime: Date): Promise<IShowRes[]> {
        return await showModel.find({
            screenId,
            $or: [
                {
                  $and: [
                    { startTime: { $lte: startTime } }, // Existing show starts before or at the same time as the new show
                    { endTime: { $gte: startTime } }   // Existing show ends after or at the same time as the new show starts
                  ]
                },
                {
                  $and: [
                    { startTime: { $lte: endTime } },   // Existing show starts before or at the same time as the new show ends
                    { endTime: { $gte: endTime } }      // Existing show ends after or at the same time as the new show ends
                  ]
                },
                {
                  $and: [
                    { startTime: { $gte: startTime } }, // Existing show starts after or at the same time as the new show starts
                    { endTime: { $lte: endTime } }     // Existing show ends before or at the same time as the new show ends
                  ]
                }
              ]
        })
    }
}