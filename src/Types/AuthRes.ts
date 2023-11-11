import { IAdmin } from "../interfaces/schema/adminSchema"
import { ITheater } from "../interfaces/schema/theaterRepo"
import { User } from "../interfaces/schemaInterface"


export type AuthRes = {
    status: number,
    message: string,
    data?: IAdmin | ITheater | User | null
    token: string
}