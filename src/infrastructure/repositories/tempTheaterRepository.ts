import { tempTheaterModel } from "../db/temp/tempTheaterModel";
import { ITempTheaterRepo } from "../../useCases/repos/tempTheaterRepo";
import { ITempTheaterReq, ITempTheaterRes } from "../../interfaces/schema/tempTheaterSchema";


export class TempTheaterRepository implements ITempTheaterRepo {
    async saveTheater(theater: ITempTheaterReq): Promise<ITempTheaterRes> {
        return tempTheaterModel.findOneAndUpdate(
            { email: theater.email },
            {
                $set: {
                    name: theater.name,
                    email: theater.email,
                    otp: theater.otp,
                    liscenceId: theater.liscenceId,
                    coords: theater.coords,
                    address: theater.address,
                    password: theater.password,
                    expireAt: Date.now()
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
    }

    async unsetTheaterOTP(id: string, email: string): Promise<ITempTheaterRes | null> {
        return await tempTheaterModel.findByIdAndUpdate(
            { _id: id, email },
            { $unset: { otp: 1 } },
            { new: true }
        );
    }

    async findTempTheaterById(id: string): Promise<ITempTheaterRes | null> {
        return await tempTheaterModel.findById({ _id: id })
    }

    async updateTheaterOTP(id: string, email: string, OTP: number): Promise<ITempTheaterRes | null> {
        return tempTheaterModel.findOneAndUpdate(
            { _id: id, email },
            {
                $set: { otp: OTP }
            },
            { new: true }
        )
    }
}
