export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    mobile?: number
    dob?: Date
    isBlocked: boolean
    profilePic: string
    wallet?: number | null
    location?: {
        longitude: number,
        latitude: number
    }
    address?: {
        country: string
        state: string
        district: string
        city: string
        zip: number
    }
}
