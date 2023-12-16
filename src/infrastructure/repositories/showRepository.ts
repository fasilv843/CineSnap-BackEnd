import { movieModel } from "../../entities/models/movieModel";
import { screenModel } from "../../entities/models/screensModel";
import { showModel } from "../../entities/models/showModel";
// import { showModel } from "../../entities/models/showModel";
// import { theaterModel } from "../../entities/models/theaterModel";
import { ID } from "../../interfaces/common";
import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { IScreen } from "../../interfaces/schema/screenSchema";
import { IShow, IShowRequirements, IShowRes, IShowSeat, IShowsOnAScreen } from "../../interfaces/schema/showSchema";




export class ShowRepository implements IShowRepo {
    async saveShow(show: IShowRequirements): Promise<IShow> {
        const movie = await movieModel.findById(show.movieId) as IMovie
        const screen = await screenModel.findById(show.screenId) as IScreen
        if (screen !== null || movie !== null) {
            const showSeat: Map<string, Array<IShowSeat>> = new Map()

            for (const row of screen.seats.keys()) {
                const rowArr = screen.seats.get(row)?.map(col => ({ col, isBooked: false })) || [];
                showSeat.set(row, rowArr)
            }

            const startTime = new Date(show.startTime);
            // console.log(startTime, 'show start time');

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + movie.duration.hours);
            endTime.setMinutes(startTime.getMinutes() + movie.duration.minutes);

            const ticketPrice: number = show.ticketPrice ?? screen.defaultPrice
            const showTosave: Omit<IShow, '_id'> = {
                movieId: show.movieId,
                screenId: show.screenId,
                startTime: show.startTime,
                endTime,
                ticketPrice,
                seats: showSeat,
                totalSeatCount: screen.seatsCount,
                availableSeatCount: screen.seatsCount
            }
            return await new showModel(showTosave).save()
        } else {
            throw Error('screen or movie id is not available')
        }
    }

    // async editShow (showId: ID, show: IShowRequirements): Promise<IShowRes> {
    //     const movie = await movieModel.findById(show.movieId) as IMovie
    //     const screen = await screenModel.findById(show.screenId) as IScreen
    //     if (screen !== null || movie !== null) {
            // const showSeat: Map<string, Array<IShowSeat>> = new Map()

            // for (const row of screen.seats.keys()) {
            //     const rowArr = screen.seats.get(row)?.map(col => ({ col, isBooked: false })) || [];
            //     showSeat.set(row, rowArr)
            // }

            // const startTime = new Date(show.startTime);
            // console.log(startTime, 'show start time');

            // const endTime = new Date(startTime);
            // endTime.setHours(startTime.getHours() + movie.duration.hours);
            // endTime.setMinutes(startTime.getMinutes() + movie.duration.minutes);

            // const ticketPrice: number = show.ticketPrice ?? screen.defaultPrice
            // const showTosave: Omit<IShow, '_id'> = {
            //     movieId: show.movieId,
            //     screenId: show.screenId,
            //     startTime: show.startTime,
            //     endTime,
            //     ticketPrice,
            //     seats: showSeat,
            //     totalSeatCount: screen.seatsCount,
            //     availableSeatCount: screen.seatsCount
            // }
            // return 
    //     } else {
    //         throw Error('screen or movie id is not available')
    //     }
    // }

    async findShowsOnDate  (theaterId: ID, date: Date): Promise<IShowsOnAScreen[]> {
        // console.log(date, 'date from repo');
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        // console.log('aggregate starting with ', theaterId);

        // Step 1: Find screens that match the theaterId
        const screens = await screenModel.find({ theaterId }) as unknown as IScreen[]

        // Step 2: Get shows for each screen within the specified time range
        const showsPromises = screens.map(async (screen) => {
            const screenShows = await showModel.find({
                screenId: screen._id,
                startTime: { $gte: startOfDay, $lte: endOfDay }
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
}