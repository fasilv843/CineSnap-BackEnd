import { movieModel } from "../../entities/models/movieModel";
import { screenModel } from "../../entities/models/screensModel";
import { showModel } from "../../entities/models/showModel";
// import { showModel } from "../../entities/models/showModel";
// import { theaterModel } from "../../entities/models/theaterModel";
import { ID } from "../../interfaces/common";
import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IMovie } from "../../interfaces/schema/movieSchema";
import { IScreen } from "../../interfaces/schema/screenSchema";
import { IShow, IShowRequirements, IShowRes, IShowSeat } from "../../interfaces/schema/showSchema";




export class ShowRepository implements IShowRepo {
    async saveShow(show: IShowRequirements): Promise<IShowRes> {
        const movie = await movieModel.findById(show.movieId) as IMovie
        const screen = await screenModel.findById(show.screenId) as IScreen
        if (screen !== null || movie !== null) {
            const showSeat: Map<string, Array<IShowSeat>> = new Map()

            for (const row of screen.seats.keys()) {
                const rowArr = screen.seats.get(row)?.map(col => ({ col, isBooked: false })) || [];
                showSeat.set(row, rowArr)
            }

            const startTime = new Date(show.startTime);
            console.log(startTime, 'show start time');

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

    // findShowsOnTheater (theaterId: ID) {

    // }
}