import { theaterModel } from "../../entities/models/theaterModel";
import { ITheaterRepo } from "../../interfaces/repos/theaterRepo";
import { ICoords, ID, IWalletHistoryAndCount } from "../../interfaces/common";
import { ITheater, ITheaterRes, ITheaterUpdate } from "../../interfaces/schema/theaterSchema";
import { ITempTheaterRes } from "../../interfaces/schema/tempTheaterSchema";



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
                approvalStatus: 'Approved'
            });

            return theaters;

        } catch (error) {
            console.log(error);
            throw Error('error while getting nearest theaters')
        }
    }

    async getNearestTheatersByLimit(lon: number, lat: number, limit: number, maxDistance: number): Promise<ITheater[]> {
        const nearestTheaters: ITheater[] = await theaterModel.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lon, lat],
                    },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: maxDistance * 1000 * 1000, // Convert maxDistance to meters, then * 1000
                },
            },
            { $match: { approvalStatus: 'Approved' } },
            { $sort: { distance: 1 } },
            { $limit: limit },
        ]);

        return nearestTheaters;
    }

    async saveTheater(theater: ITempTheaterRes): Promise<ITheater> {
        const theaterData: Omit<ITempTheaterRes, '_id' | 'otp'> = { ...JSON.parse(JSON.stringify(theater)), _id: undefined, otp: undefined }
        return await new theaterModel(theaterData).save()
    }

    async findByEmail(email: string): Promise<ITheater | null> {
        return await theaterModel.findOne({ email })
    }

    async findById(id: ID): Promise<ITheater | null> {
        return await theaterModel.findById({ _id: id })
    }

    // async findByLocation(location: ILocation): Promise<ITheater | null> {
    //     throw new Error("Method not implemented.");
    // }

    async findAllTheaters(page: number, limit: number, searchQuery: string): Promise<ITheaterRes[]> {
        const regex = new RegExp(searchQuery, 'i')
        return await theaterModel.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
                { mobile: { $regex: regex } }
            ]
        })
        .skip((page -1) * limit)
        .limit(limit)
        .select('-password')
        .exec()
    }

    async findTheaterCount (searchQuery: string): Promise<number> {
        const regex = new RegExp(searchQuery, 'i')
        return await theaterModel.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
                { mobile: { $regex: regex } }
            ]
        }).count()
    }

    async blockTheater(theaterId: string) {
        try {
            const theater = await theaterModel.findById({ _id: theaterId })
            if (theater !== null) {
                theater.isBlocked = !theater.isBlocked
                await theater.save()
            } else {
                throw Error('Something went wrong, theaterId did\'t received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    }

    async updateTheater(theaterId: ID, theater: ITheaterUpdate): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                name: theater.name,
                mobile: theater.mobile,
                address: theater.address,
                coords: theater.coords
            },
            { new: true }
        )
    }

    async approveTheater(theaterId: ID): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                approvalStatus: 'Approved'
            },
            { new: true }
        )
    }

    async rejectTheater(theaterId: ID): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                approvalStatus: 'Rejected'
            },
            { new: true }
        )
    }

    async updateTheaterProfilePic(theaterId: ID, fileName: string): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                $set: {
                    profilePic: fileName
                }
            },
            { new: true }
        )
    }

    async removeTheaterProfilePic(theaterId: ID): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                $unset: {
                    profilePic: ''
                }
            },
            { new: true }
        )
    }

    async updateWallet (theaterId: ID, amount: number, message: string): Promise<ITheaterRes | null> {
        // const walletHistory: Omit<IWalletHistory, 'date'> = {
        //     amount,
        //     message
        // }
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount , message} }
            },
            { new: true }
        )
    }

    async updateScreenCount (theaterId: ID, count: number): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            { $inc: { screenCount: count }},
            { new: true }
        )  
    }

    async getWalletHistory (theaterId: ID, page: number = 1, limit: number = 10): Promise<IWalletHistoryAndCount | null> {
        const theaterData = await theaterModel.findById({ _id: theaterId })

        return theaterData !== null 
            ? { 
                walletHistory: theaterData.walletHistory.slice((page - 1) * limit, page * limit), 
                count: theaterData.walletHistory.length 
            } 
            : null
    }
}