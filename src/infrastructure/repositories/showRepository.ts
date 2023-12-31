import { screenModel } from "../../entities/models/screensModel";
import { showModel } from "../../entities/models/showModel";
import { ID } from "../../interfaces/common";
import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { IScreen } from "../../interfaces/schema/screenSchema";
import { IShow, IShowRes, IShowToSave, IShowsOnAScreen } from "../../interfaces/schema/showSchema";




export class ShowRepository implements IShowRepo {
    // async saveShowOld(show: IShowRequirements): Promise<IShow> {
    //     const movie = await movieModel.findById(show.movieId) as IMovie
    //     const screen = await screenModel.findById(show.screenId) as IScreen
    //     if (screen !== null || movie !== null) {
    //         const showSeat: Map<string, Array<IShowSeat>> = new Map()

    //         for (const row of screen.seats.keys()) {
    //             const rowArr = screen.seats.get(row)?.map(col => ({ col, isBooked: false })) || [];
    //             showSeat.set(row, rowArr)
    //         }

    //         const startTime = new Date(show.startTime);
    //         // console.log(startTime, 'show start time');

    //         const endTime = new Date(startTime);
    //         endTime.setHours(startTime.getHours() + movie.duration.hours);
    //         endTime.setMinutes(startTime.getMinutes() + movie.duration.minutes);

    //         // const ticketPrice: number = show.ticketPrice
    //         const showTosave: Omit<IShow, '_id'> = {
    //             movieId: show.movieId,
    //             screenId: show.screenId,
    //             startTime: show.startTime,
    //             endTime,
    //             // ticketPrice,
    //             seats: showSeat,
    //             totalSeatCount: screen.seatsCount,
    //             availableSeatCount: screen.seatsCount
    //         }
    //         return await new showModel(showTosave).save()
    //     } else {
    //         throw Error('screen or movie id is not available')
    //     }
    // }

    async saveShow (showTosave: IShowToSave): Promise<IShow> {
        return await new showModel(showTosave).save()
    }

    async findShowsOnDate  (theaterId: ID, from: Date, to: Date): Promise<IShowsOnAScreen[]> {

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

    async getShowDetails (showId: ID): Promise<IShow | null> {
        return await showModel.findById(showId).populate('movieId')
    }

    async getCollidingShowsOnTheScreen (screenId: ID, startTime: Date, endTime: Date): Promise<IShowRes[]> {
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