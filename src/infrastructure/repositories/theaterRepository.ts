import { theaterModel } from "../../entities/models/theaterModel";
import { ITheaterRepo } from "../../interfaces/repos/theaterRepo";
import { ITheater } from "../../interfaces/schema/theaterSchema";



export class TheaterRepository implements ITheaterRepo {

    async saveTheater(theater: ITheater): Promise<ITheater> {
        return await new theaterModel(theater).save()
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