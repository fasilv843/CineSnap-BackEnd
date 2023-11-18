import { theaterModel } from "../../entities/models/theaterModel";
import { ITheaterRepo } from "../../interfaces/repos/theaterRepo";
import { ICoords } from "../../interfaces/schema/common";
import { ITheater } from "../../interfaces/schema/theaterSchema";



export class TheaterRepository implements ITheaterRepo {

    async getNearestTheaters(lon: number, lat: number, radius: number): Promise<[] | ITheater[]> {
        try {

            const searchLocation: ICoords = {
                type: 'Point',
                coordinates: [lon, lat],
            };

            const theaters = await theaterModel.find({
                coords: {
                    $near: {
                        $geometry: searchLocation,
                        $maxDistance: radius,
                    },
                },
            });

            return theaters;

        } catch (error) {
            console.log(error);
            throw Error('error while getting nearest theaters')
        }
    }

    async getNearestTheatersByLimit(lon: number, lat: number, limit: number, maxDistance: number): Promise<ITheater[]> {
        try {

            const nearestTheaters: ITheater[] = await theaterModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [lon, lat],
                        },
                        distanceField: 'distance',
                        spherical: true,
                        maxDistance: maxDistance * 1000, // Convert maxDistance to meters
                    },
                },
                { $sort: { distance: 1 } },
                { $limit: limit },
            ]);

            // console.log(nearestTheaters, 'nearest theaters from repository limit');
            
            return nearestTheaters;
        } catch (error) {
            throw new Error('Error fetching nearest theaters');
        }
    }

    async saveTheater(theater: ITheater): Promise<ITheater> {
        try {
            console.log(theater);
            return await new theaterModel(theater).save()    
        } catch (error) {
            console.log(error);
            throw Error('Error during saving theater details')
        }
    }

    async findByEmail(email: string): Promise<ITheater | null> {
        return await theaterModel.findOne({email})
    }

    async findById(id: string): Promise<ITheater | null> {
        return await theaterModel.findById({_id: id})
    }
    
    // async findByLocation(location: ILocation): Promise<ITheater | null> {
    //     throw new Error("Method not implemented.");
    // }

    async findAllTheaters(): Promise<[] | ITheater[]> {
        return await theaterModel.find()
    }

    async blockTheater (theaterId: string) {
        try {
            const theater = await theaterModel.findById({_id: theaterId})
            if(theater !== null){
                theater.isBlocked = !theater.isBlocked
                await theater.save()
            }else{
                throw Error('Something went wrong, theaterId did\'t received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    }

}